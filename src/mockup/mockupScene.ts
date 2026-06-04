/**
 * Headless Three.js renderer for photorealistic device mockups.
 *
 * Loads a device GLB, maps an app screenshot onto the screen mesh with emissive
 * lighting, and exports WebP/PNG via `gl` + `sharp`. Used by the Vite plugin
 * subprocess and {@link ../scripts/render-mockups.ts}.
 *
 * @module mockupScene
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import createGl from 'gl'
import sharp from 'sharp'
import * as THREE from 'three'
import { deviceDefinitions, screenMaterialKeysToSkip } from './devices'
import { createGltfLoader } from './loadGltf'
import { installThreeNodePolyfills } from './nodePolyfills'
import type { DeviceDefinition, DeviceId, MockupRenderOptions, MockupRenderResult } from './types'

export { loadPreset, mergePreset } from './presets'

/** Stubs WebGL2 entry points missing from headless-gl so Three.js r160 can initialize. */
function patchHeadlessGlContext(context: WebGLRenderingContext | null): void {
	if (!context) {
		throw new Error('Failed to create headless WebGL context.')
	}

	const gl = context as WebGLRenderingContext & Record<string, unknown>

	if (typeof gl.texImage3D !== 'function') {
		gl.texImage3D = () => undefined
	}

	if (typeof gl.texStorage3D !== 'function') {
		gl.texStorage3D = () => undefined
	}

	if (typeof gl.framebufferTextureLayer !== 'function') {
		gl.framebufferTextureLayer = () => undefined
	}
}

/** Reads a GLB from `src/assets/devices/` relative to cwd. */
function readGlb(relativePath: string): ArrayBuffer {
	const absolutePath = path.join(process.cwd(), relativePath)
	const buffer = readFileSync(absolutePath)
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

/** Decodes a screenshot PNG/JPEG/WebP into an sRGB Three.js texture. */
async function loadScreenshotTexture(screenshotPath: string): Promise<THREE.Texture> {
	const { data, info } = await sharp(screenshotPath)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true })

	const texture = new THREE.DataTexture(
		new Uint8Array(data),
		info.width,
		info.height,
		THREE.RGBAFormat,
	)
	texture.flipY = true
	if ('colorSpace' in texture) {
		;(texture as THREE.Texture & { colorSpace: string }).colorSpace = THREE.SRGBColorSpace
	} else {
		;(texture as THREE.Texture & { encoding: number }).encoding = THREE.sRGBEncoding
	}
	texture.needsUpdate = true
	return texture
}

/** Applies the titanium body tint to non-screen iPhone materials. */
function tintIphoneMaterials(model: THREE.Object3D, bodyColor: number): void {
	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) {
			return
		}

		const materials = Array.isArray(object.material) ? object.material : [object.material]
		for (const material of materials) {
			if (!(material instanceof THREE.MeshStandardMaterial)) {
				continue
			}

			if (screenMaterialKeysToSkip.has(material.name)) {
				continue
			}

			material.color = new THREE.Color(bodyColor)
			material.needsUpdate = true
		}
	})
}

/**
 * Replaces the screen mesh material with an emissive PBR material
 * so the screenshot reads as a self-lit display.
 */
function applyScreenshotTexture(
	model: THREE.Object3D,
	screenMeshName: string,
	texture: THREE.Texture,
	screenEmissiveIntensity: number,
): void {
	let applied = false

	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh) || object.name !== screenMeshName) {
			return
		}

		object.material = new THREE.MeshStandardMaterial({
			map: texture,
			emissiveMap: texture,
			emissive: new THREE.Color(0xffffff),
			emissiveIntensity: screenEmissiveIntensity,
			roughness: 1,
			metalness: 0,
		})
		applied = true
	})

	if (!applied) {
		throw new Error(`Screen mesh "${screenMeshName}" not found in device model.`)
	}
}

/**
 * iPhone GLB stacks glass meshes above the display — thin them so emissive shows through.
 * Higher {@link screenEmissiveIntensity} values yield more transparent glass.
 */
function softenIphoneScreenGlass(model: THREE.Object3D, screenEmissiveIntensity: number): void {
	const glassOpacity = Math.max(0.04, 0.28 - screenEmissiveIntensity * 0.22)

	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) {
			return
		}

		const materials = Array.isArray(object.material) ? object.material : [object.material]
		for (const material of materials) {
			if (
				!(material instanceof THREE.MeshStandardMaterial) ||
				!screenMaterialKeysToSkip.has(material.name)
			) {
				continue
			}

			material.transparent = true
			material.opacity = glassOpacity
			material.metalness = 0.1
			material.roughness = 0.05
			material.depthWrite = false
			material.needsUpdate = true
		}
	})
}

/** Applies emissive screen material and device-specific glass/overlay tweaks. */
function applyDeviceScreenMaterial(
	model: THREE.Object3D,
	device: DeviceDefinition,
	texture: THREE.Texture,
): void {
	const screenEmissiveIntensity = device.screenEmissiveIntensity ?? 0.75

	applyScreenshotTexture(model, device.screenMeshName, texture, screenEmissiveIntensity)

	if (device.id === 'iphone15') {
		softenIphoneScreenGlass(model, screenEmissiveIntensity)
	}
}

/** Creates a headless WebGL renderer backed by the `gl` package. */
function createHeadlessRenderer(width: number, height: number): {
	renderer: THREE.WebGLRenderer
	readPixels: () => Buffer
	dispose: () => void
} {
	const context = createGl(width, height, { preserveDrawingBuffer: true, antialias: true })
	patchHeadlessGlContext(context)
	const canvas = {
		width,
		height,
		style: {},
		addEventListener: () => undefined,
		removeEventListener: () => undefined,
		getContext: (type: string) =>
			type === 'webgl' || type === 'webgl2' ? context : null,
	} as unknown as HTMLCanvasElement & {
		cancelAnimationFrame: (id: number) => void
		requestAnimationFrame: (callback: FrameRequestCallback) => number
	}

	canvas.requestAnimationFrame = (callback: FrameRequestCallback) =>
		setTimeout(() => callback(Date.now()), 0) as unknown as number
	canvas.cancelAnimationFrame = () => undefined

	const renderer = new THREE.WebGLRenderer({
		canvas,
		context: context as unknown as WebGLRenderingContext,
		antialias: true,
		alpha: true,
	})
	renderer.setSize(width, height, false)
	if ('outputColorSpace' in renderer) {
		renderer.outputColorSpace = THREE.SRGBColorSpace
	}

	return {
		renderer,
		readPixels: () => {
			const pixels = new Uint8Array(width * height * 4)
			context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, pixels)

			const rowSize = width * 4
			const rgba = Buffer.alloc(width * height * 4)
			for (let y = 0; y < height; y += 1) {
				rgba.set(
					pixels.subarray((height - 1 - y) * rowSize, (height - y) * rowSize),
					y * rowSize,
				)
			}

			return rgba
		},
		dispose: () => undefined,
	}
}

/** Parses preset background strings into Three.js clear-color values. */
function parseBackground(background: string): { color: THREE.Color; alpha: number } {
	if (background === 'transparent') {
		return { color: new THREE.Color(0x000000), alpha: 0 }
	}

	const hex = background.replace('#', '')
	return { color: new THREE.Color(`#${hex}`), alpha: 1 }
}

/** Loads and optionally tints a device GLB from {@link deviceDefinitions}. */
async function loadDeviceModel(deviceId: DeviceId): Promise<THREE.Group> {
	const device = deviceDefinitions[deviceId]
	const loader = createGltfLoader()
	const gltf = await loader.parseAsync(
		readGlb(path.join('src/assets/devices', device.glbFileName)),
		'',
	)

	const model = gltf.scene.clone(true)
	if (deviceId === 'iphone15') {
		tintIphoneMaterials(model, device.bodyColor)
	}

	return model
}

/** Serializes headless GL renders — only one WebGL context at a time. */
let renderQueue: Promise<unknown> = Promise.resolve()

/**
 * Renders a device mockup image from a screenshot and preset.
 *
 * Renders are queued internally because headless-gl supports only one
 * active context per process.
 *
 * @param options - Screenshot path, device, preset, and optional overrides.
 * @returns Encoded image buffer with final dimensions.
 */
export async function renderMockup(options: MockupRenderOptions): Promise<MockupRenderResult> {
	const task = renderQueue.then(() => renderMockupInternal(options))
	renderQueue = task.then(() => undefined).catch(() => undefined)
	return task
}

async function renderMockupInternal(options: MockupRenderOptions): Promise<MockupRenderResult> {
	installThreeNodePolyfills()

	const preset = options.preset
	const width = (options.width ?? preset.width) - 128
	const height = options.height ?? preset.height
	const format = options.format ?? 'webp'
	const background = options.background ?? preset.background
	const rotationX = options.rotationX ?? preset.rotationX
	const rotationY = options.rotationY ?? preset.rotationY
	const rotationZ = options.rotationZ ?? preset.rotationZ
	const device = deviceDefinitions[options.deviceId]

	const screenshotTexture = await loadScreenshotTexture(options.screenshotPath)
	const model = await loadDeviceModel(options.deviceId)

	applyDeviceScreenMaterial(model, device, screenshotTexture)

	const { renderer, readPixels, dispose } = createHeadlessRenderer(width, height)
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(preset.cameraFov, width / height, 0.001, 100)

	scene.add(model)

	const bounds = new THREE.Box3().setFromObject(model)
	const center = bounds.getCenter(new THREE.Vector3())
	const size = bounds.getSize(new THREE.Vector3())
	model.position.sub(center)

	const maxDimension = Math.max(size.x, size.y, size.z)
	const distance = maxDimension * preset.cameraDistanceFactor
	camera.position.set(
		distance * preset.cameraXOffsetFactor,
		size.y * preset.cameraYOffsetFactor,
		distance,
	)
	camera.lookAt(0, 0, 0)

	scene.add(new THREE.AmbientLight(0xffffff, 0.55))

	const keyLight = new THREE.DirectionalLight(0xffffff, 1.35)
	keyLight.position.set(3, 5, 6)
	scene.add(keyLight)

	const fillLight = new THREE.DirectionalLight(0xffffff, 0.35)
	fillLight.position.set(-4, 1, 2)
	scene.add(fillLight)

	model.rotation.set(
		THREE.MathUtils.degToRad(rotationX + (device.modelRotationX ?? 0)),
		THREE.MathUtils.degToRad(rotationY + (device.modelRotationY ?? 0)),
		THREE.MathUtils.degToRad(rotationZ + (device.modelRotationZ ?? 0)),
	)

	const { color, alpha } = parseBackground(background)
	renderer.setClearColor(color, alpha)
	renderer.render(scene, camera)

	const rgba = readPixels()
	dispose()
	screenshotTexture.dispose()

	const pipeline = sharp(rgba, { raw: { width, height, channels: 4 } })

	const data =
		format === 'png'
			? await pipeline.png().toBuffer()
			: await pipeline.webp({ quality: 88 }).toBuffer()

	return { data, width, height, format }
}
