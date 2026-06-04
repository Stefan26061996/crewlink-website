/**
 * Vite plugin that bakes 3D device mockups at build/dev time.
 *
 * Intercepts screenshot imports with a `?mockup=` query, renders headlessly via
 * a subprocess (`npm run render-mockups`), caches output on disk, and returns
 * `{ src, width, height }` for use in `<img>` tags — no client-side WebGL.
 *
 * @example
 * ```ts
 * import mockup from './screenshots/app.png?mockup=iphone15&preset=feature-leading&format=webp&w=600'
 * // mockup.src  → '/assets/app-mockup-abc.webp' (build) or '/@device-mockup/…' (dev)
 * // mockup.width, mockup.height → rendered dimensions
 * ```
 *
 * **Query parameters**
 *
 * | Param | Purpose |
 * |-------|---------|
 * | `mockup` | Device id: `iphone15` \| `pixel8pro` |
 * | `preset` | Named angle from `src/mockup/presets/*.json` |
 * | `w`, `h` | Output dimensions (overrides preset) |
 * | `format` | `webp` (default) or `png` |
 * | `bg` | `transparent` or hex background |
 * | `rotateX`, `rotateY`, `rotateZ` | Degree overrides |
 *
 * @module deviceMockup
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'
import { deviceDefinitions, resolveDeviceId } from '../mockup/devices'
import { loadPreset, mergePreset } from '../mockup/presets'
import type { DeviceId, MockupPreset } from '../mockup/types'

const IMAGE_EXTENSION = /\.(png|jpe?g|webp)$/i
const MOCKUP_QUERY = /[?&]mockup=/
/** Dev-server URL prefix for cached mockup assets (`emitFile` is unavailable in serve mode). */
const DEV_MOCKUP_PREFIX = '/@device-mockup/'

/** Module shape returned by `?mockup=` imports. */
export type DeviceMockupMeta = {
	src: string
	width: number
	height: number
}

/** Parsed import-query options from a mockup import URL. */
type ParsedQuery = {
	mockup: string
	preset?: string
	format: 'webp' | 'png'
	width?: number
	height?: number
	background?: string
	rotateX?: number
	rotateY?: number
	rotateZ?: number
}

/** In-memory result after loading or rendering a cached mockup file. */
type RenderedMockup = {
	buffer: Buffer
	width: number
	height: number
	cacheKey: string
	format: 'webp' | 'png'
}

/**
 * Parses a Vite import id such as
 * `./app.png?mockup=iphone15&preset=feature-leading&w=600`.
 *
 * @returns Parsed file path and query, or `null` when the id is not a mockup import.
 */
function parseMockupImportId(id: string): { filePath: string; query: ParsedQuery } | null {
	const queryIndex = id.indexOf('?')
	if (queryIndex === -1 || !MOCKUP_QUERY.test(id)) {
		return null
	}

	const filePath = id.slice(0, queryIndex)
	if (!IMAGE_EXTENSION.test(filePath)) {
		return null
	}

	const params = new URLSearchParams(id.slice(queryIndex + 1))
	const mockup = params.get('mockup')
	if (!mockup) {
		return null
	}

	return {
		filePath,
		query: {
			mockup,
			preset: params.get('preset') ?? undefined,
			format: params.get('format') === 'png' ? 'png' : 'webp',
			width: parseOptionalNumber(params.get('w')),
			height: parseOptionalNumber(params.get('h')),
			background: params.get('bg') ?? undefined,
			rotateX: parseOptionalNumber(params.get('rotateX')),
			rotateY: parseOptionalNumber(params.get('rotateY')),
			rotateZ: parseOptionalNumber(params.get('rotateZ')),
		},
	}
}

/** Parses an integer query param, returning `undefined` when absent or invalid. */
function parseOptionalNumber(value: string | null): number | undefined {
	if (!value) {
		return undefined
	}

	const parsed = Number.parseInt(value, 10)
	return Number.isFinite(parsed) ? parsed : undefined
}

/** Loads a named preset and merges import-query overrides. */
function resolvePreset(query: ParsedQuery): MockupPreset {
	if (!query.preset) {
		throw new Error('Device mockup imports require a preset query parameter.')
	}

	const preset = loadPreset(query.preset)
	return mergePreset(preset, {
		width: query.width,
		height: query.height,
		background: query.background,
		rotationX: query.rotateX,
		rotationY: query.rotateY,
		rotationZ: query.rotateZ,
	})
}

/**
 * Builds a deterministic cache key from screenshot bytes, device, preset, and format.
 * Includes device orientation and emissive settings so cache invalidates when those change.
 */
function buildCacheKey(
	screenshotPath: string,
	deviceId: DeviceId,
	preset: MockupPreset,
	format: 'webp' | 'png',
): string {
	const device = deviceDefinitions[deviceId]
	const screenshot = readFileSync(screenshotPath)
	const hash = createHash('sha256')
	hash.update(screenshot)
	hash.update(deviceId)
	hash.update(
		JSON.stringify({
			modelRotationX: device.modelRotationX ?? 0,
			modelRotationY: device.modelRotationY ?? 0,
			modelRotationZ: device.modelRotationZ ?? 0,
			screenEmissiveIntensity: device.screenEmissiveIntensity ?? 0.75,
		}),
	)
	hash.update(JSON.stringify(preset))
	hash.update(format)
	return hash.digest('hex')
}

/** Absolute path for a cached mockup image inside `node_modules/.cache/device-mockup/`. */
function cachePathForKey(cacheKey: string, format: 'webp' | 'png'): string {
	return path.join(process.cwd(), 'node_modules/.cache/device-mockup', `${cacheKey}.${format}`)
}

/** Reads the sidecar `.meta.json` written by `render-mockups`. */
function readCacheMeta(metaPath: string): DeviceMockupMeta & { format: 'webp' | 'png' } {
	return JSON.parse(readFileSync(metaPath, 'utf8')) as DeviceMockupMeta & { format: 'webp' | 'png' }
}

/** Sanitizes a Rollup asset reference id for use in generated ESM. */
function toRollupReferenceId(referenceId: string): string {
	return referenceId.replace(/[^\w$]/g, '_')
}

function mimeTypeForFormat(format: 'webp' | 'png'): string {
	return format === 'png' ? 'image/png' : 'image/webp'
}

/** Ensures subprocess renders run one at a time (headless-gl limitation). */
let subprocessQueue: Promise<unknown> = Promise.resolve()

/**
 * Invokes `npm run render-mockups` in a child process so WebGL runs outside
 * the Vite config bundle (which breaks headless-gl context creation).
 */
function renderInSubprocess(
	screenshotPath: string,
	deviceId: string,
	query: ParsedQuery,
	outputPath: string,
): Promise<{ buffer: Buffer; width: number; height: number }> {
	const task = subprocessQueue.then(() => {
		mkdirSync(path.dirname(outputPath), { recursive: true })

		const commandArgs = [
			'run',
			'render-mockups',
			'--',
			'--screenshot',
			screenshotPath,
			'--device',
			deviceId,
			'--preset',
			query.preset ?? 'feature-leading',
			'--output',
			outputPath,
		]

		if (query.width) {
			commandArgs.push('--width', String(query.width))
		}

		if (query.height) {
			commandArgs.push('--height', String(query.height))
		}

		if (query.background) {
			commandArgs.push('--background', query.background)
		}

		if (query.rotateX !== undefined) {
			commandArgs.push('--rotateX', String(query.rotateX))
		}

		if (query.rotateY !== undefined) {
			commandArgs.push('--rotateY', String(query.rotateY))
		}

		if (query.rotateZ !== undefined) {
			commandArgs.push('--rotateZ', String(query.rotateZ))
		}

		execFileSync('npm', commandArgs, {
			cwd: process.cwd(),
			stdio: 'pipe',
			env: process.env,
		})

		const meta = readCacheMeta(`${outputPath}.meta.json`)

		return {
			buffer: readFileSync(outputPath),
			width: meta.width,
			height: meta.height,
		}
	})

	subprocessQueue = task.then(() => undefined).catch(() => undefined)
	return task
}

/** Returns cached mockup bytes or renders via subprocess on cache miss. */
async function ensureMockup(
	parsed: { filePath: string; query: ParsedQuery },
): Promise<RenderedMockup> {
	const screenshotPath = parsed.filePath
	const deviceId = resolveDeviceId(parsed.query.mockup)
	const preset = resolvePreset(parsed.query)
	const format = parsed.query.format
	const cacheKey = buildCacheKey(screenshotPath, deviceId, preset, format)
	const outputPath = cachePathForKey(cacheKey, format)
	const metaPath = `${outputPath}.meta.json`

	let imageBuffer: Buffer
	let width = preset.width ?? 800
	let height = preset.height ?? 800

	if (existsSync(outputPath) && existsSync(metaPath)) {
		imageBuffer = readFileSync(outputPath)
		const meta = readCacheMeta(metaPath)
		width = meta.width
		height = meta.height
	} else {
		const rendered = await renderInSubprocess(
			screenshotPath,
			deviceId,
			parsed.query,
			outputPath,
		)
		imageBuffer = rendered.buffer
		width = rendered.width
		height = rendered.height
	}

	return { buffer: imageBuffer, width, height, cacheKey, format }
}

/** Serves pre-rendered mockup files from disk during `vite dev`. */
function createDevMiddleware(): Connect.NextHandleFunction {
	return (req, res, next) => {
		const requestUrl = req.url?.split('?')[0]
		if (!requestUrl?.startsWith(DEV_MOCKUP_PREFIX)) {
			next()
			return
		}

		const fileName = path.basename(requestUrl)
		const filePath = path.join(process.cwd(), 'node_modules/.cache/device-mockup', fileName)

		if (!existsSync(filePath)) {
			res.statusCode = 404
			res.end('Mockup not found')
			return
		}

		const format = fileName.endsWith('.png') ? 'png' : 'webp'
		res.setHeader('Content-Type', mimeTypeForFormat(format))
		res.setHeader('Cache-Control', 'no-cache')
		res.end(readFileSync(filePath))
	}
}

/**
 * Vite plugin factory for build-time 3D device mockups.
 *
 * Register in `vite.config.ts` before other asset plugins:
 * ```ts
 * plugins: [deviceMockup(), vue(), …]
 * ```
 */
export function deviceMockup(): Plugin {
	let isBuild = false

	return {
		name: 'device-mockup',
		enforce: 'pre',
		config(_config, { command }) {
			isBuild = command === 'build'
		},
		configureServer(server) {
			server.middlewares.use(createDevMiddleware())
		},
		async resolveId(source, importer) {
			if (!MOCKUP_QUERY.test(source)) {
				return null
			}

			const parsed = parseMockupImportId(source)
			if (!parsed) {
				return null
			}

			const absoluteSource = source.startsWith('/')
				? source
				: importer
					? path.resolve(path.dirname(importer), source)
					: path.resolve(process.cwd(), source)

			return `\0device-mockup:${absoluteSource}`
		},
		async load(id) {
			if (!id.startsWith('\0device-mockup:')) {
				return null
			}

			const absoluteId = id.slice('\0device-mockup:'.length)
			const parsed = parseMockupImportId(absoluteId)
			if (!parsed) {
				return null
			}

			const screenshotPath = parsed.filePath
			if (!existsSync(screenshotPath)) {
				this.error(`Screenshot not found: ${screenshotPath}`)
			}

			const deviceId = resolveDeviceId(parsed.query.mockup)
			if (!deviceDefinitions[deviceId]) {
				this.error(`Unknown device mockup "${parsed.query.mockup}"`)
			}

			this.addWatchFile(screenshotPath)

			const rendered = await ensureMockup(parsed)

			if (!isBuild) {
				const devUrl = `${DEV_MOCKUP_PREFIX}${rendered.cacheKey}.${rendered.format}`

				return `
export default {
  src: ${JSON.stringify(devUrl)},
  width: ${rendered.width},
  height: ${rendered.height},
};
`
			}

			const baseName = path.basename(screenshotPath, path.extname(screenshotPath))
			const referenceId = this.emitFile({
				type: 'asset',
				name: `${baseName}-mockup-${rendered.cacheKey.slice(0, 10)}.${rendered.format}`,
				source: rendered.buffer,
			})

			const rollupReference = toRollupReferenceId(referenceId)

			return `
export default {
  src: import.meta.ROLLUP_FILE_URL_${rollupReference},
  width: ${rendered.width},
  height: ${rendered.height},
};
`
		},
		handleHotUpdate({ file, server }) {
			if (!/\.(png|jpe?g|webp)$/i.test(file)) {
				return
			}

			const modules = server.moduleGraph.getModulesByFile(file)
			if (!modules?.size) {
				return
			}

			for (const module of modules) {
				if (module.id?.startsWith('\0device-mockup:')) {
					server.moduleGraph.invalidateModule(module)
				}
			}
		},
	}
}
