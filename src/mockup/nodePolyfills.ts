/**
 * Browser API shims required by Three.js GLTFLoader and GLTFExporter in Node.
 *
 * Installed once per process via {@link installThreeNodePolyfills}. The `canvas`
 * package is lazy-loaded through `createRequire` to avoid ESM `require` errors
 * and to defer loading until polyfills are actually needed.
 */
import { Blob } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

let installed = false

const blobData = new Map<string, Buffer>()
const require = createRequire(import.meta.url)

type CanvasModule = typeof import('canvas')

let canvasModule: CanvasModule | null = null

/** Lazy-loads the native `canvas` module (CJS) from ESM context. */
function loadCanvasModule(): CanvasModule {
	if (!canvasModule) {
		canvasModule = require('canvas') as CanvasModule
	}

	return canvasModule
}

/**
 * Patches `globalThis` with minimal DOM/Blob/fetch implementations
 * so Three.js loaders work headlessly in Node.
 *
 * Safe to call multiple times; only the first call has effect.
 */
export function installThreeNodePolyfills(): void {
	if (installed) {
		return
	}

	installed = true

	const { createCanvas, Image, loadImage } = loadCanvasModule()
	const g = globalThis as Record<string, unknown>

	g.self = globalThis
	g.window = globalThis
	g.Blob = Blob
	g.Image = Image
	g.HTMLCanvasElement = createCanvas(1, 1).constructor
	g.document = {
		createElementNS: (_namespace: string, name: string) => {
			if (name === 'canvas') {
				return createCanvas(1, 1)
			}

			if (name === 'img') {
				return new Image()
			}

			return createCanvas(1, 1)
		},
	}

	g.createImageBitmap = async (source: Blob) => {
		const buffer = Buffer.from(await source.arrayBuffer())
		const image = await loadImage(buffer)
		const canvas = createCanvas(image.width, image.height)
		const ctx = canvas.getContext('2d')
		ctx.drawImage(image, 0, 0)
		return canvas
	}

	class NodeFileReader {
		result: ArrayBuffer | string | null = null
		onload: ((event: { target: NodeFileReader }) => void) | null = null
		onloadend: ((event: { target: NodeFileReader }) => void) | null = null
		onerror: ((event: unknown) => void) | null = null

		private finish(): void {
			this.onload?.({ target: this })
			this.onloadend?.({ target: this })
		}

		readAsArrayBuffer(blob: Blob): void {
			blob.arrayBuffer()
				.then((buffer) => {
					this.result = buffer
					this.finish()
				})
				.catch((error) => {
					this.onerror?.(error)
				})
		}
	}

	g.FileReader = NodeFileReader

	class NodeProgressEvent extends Event {
		lengthComputable: boolean
		loaded: number
		total: number

		constructor(type: string, init: { lengthComputable?: boolean; loaded?: number; total?: number }) {
			super(type)
			this.lengthComputable = init.lengthComputable ?? false
			this.loaded = init.loaded ?? 0
			this.total = init.total ?? 0
		}
	}

	g.ProgressEvent = NodeProgressEvent

	;(URL as unknown as { createObjectURL: (blob: Blob) => string }).createObjectURL = (blob: Blob) => {
		const id = crypto.randomUUID()
		const url = `blob:nodedata:${id}`
		void blob.arrayBuffer().then((buffer) => {
			blobData.set(url, Buffer.from(buffer))
		})
		return url
	}

	URL.revokeObjectURL = (url: string) => {
		blobData.delete(url)
	}

	g.fetch = async (input: RequestInfo | URL) => {
		const url =
			typeof input === 'string'
				? input
				: input instanceof URL
					? input.href
					: input.url

		if (url.startsWith('blob:nodedata:')) {
			for (let attempt = 0; attempt < 200; attempt += 1) {
				const data = blobData.get(url)
				if (data) {
					return new Response(data, {
						headers: { 'Content-Type': 'application/octet-stream' },
					})
				}

				await new Promise((resolve) => setTimeout(resolve, 5))
			}

			throw new Error(`Missing blob data for ${url}`)
		}

		if (url.startsWith('file:')) {
			const filePath = fileURLToPath(url)
			const data = readFileSync(filePath)
			return new Response(data, {
				headers: { 'Content-Type': 'application/octet-stream' },
			})
		}

		throw new Error(`Fetch is not supported for URL: ${url}`)
	}
}
