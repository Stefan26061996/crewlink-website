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
import { deviceDefinitions } from './devices'
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

/**
 * Replaces the screen mesh material with an emissive PBR material
 * so the screenshot reads as a self-lit display.
 */
function applyScreenshotTexture(
	model: THREE.Object3D,
	screenMeshName: string,
	texture: THREE.Texture,
	screenEmissiveIntensity: number,
	screenTextureRotation = 0,
	screenMaterialBackFace = false,
): void {
	let applied = false

	if (screenTextureRotation !== 0) {
		texture.center.set(0.5, 0.5)
		texture.rotation = screenTextureRotation
		texture.needsUpdate = true
	}

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
			side: screenMaterialBackFace ? THREE.BackSide : THREE.FrontSide,
		})
		applied = true
	})

	if (!applied) {
		throw new Error(`Screen mesh "${screenMeshName}" not found in device model.`)
	}
}

/** Applies emissive screen material to the device screen mesh. */
function applyDeviceScreenMaterial(
	model: THREE.Object3D,
	device: DeviceDefinition,
	texture: THREE.Texture,
): void {
	const screenEmissiveIntensity = device.screenEmissiveIntensity ?? 0.75
	applyScreenshotTexture(
		model,
		device.screenMeshName,
		texture,
		screenEmissiveIntensity,
		device.screenTextureRotation ?? 0,
		device.screenMaterialBackFace ?? false,
	)
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

/** Blends frame material colors toward a brand tint while keeping PBR maps readable. */
function tintFrameMaterials(model: THREE.Object3D, device: DeviceDefinition): void {
	const {
		frameMaterialNames,
		frameAccentMaterialNames,
		frameAccentLighten = 0,
		frameTintColor,
		frameTintMix,
	} = device

	if (frameTintColor === undefined || !frameTintMix) {
		return
	}

	const tint = new THREE.Color(frameTintColor)
	const white = new THREE.Color(0xffffff)

	const applyTint = (material: THREE.MeshStandardMaterial, mix: number, lighten: number): void => {
		material.color.copy(material.color).lerp(tint, mix)
		if (lighten > 0) {
			material.color.lerp(white, lighten)
		}
		material.needsUpdate = true
	}

	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) {
			return
		}

		const materials = Array.isArray(object.material) ? object.material : [object.material]
		for (const material of materials) {
			if (!(material instanceof THREE.MeshStandardMaterial)) {
				continue
			}

			if (frameMaterialNames?.includes(material.name)) {
				applyTint(material, frameTintMix, 0)
				continue
			}

			if (frameAccentMaterialNames?.includes(material.name)) {
				applyTint(material, frameTintMix, frameAccentLighten)
			}
		}
	})
}

/** Hides duplicate screen/glass meshes bundled with the iPhone 17 Pro GLB. */
function hideDeviceMeshes(model: THREE.Object3D, hiddenMeshNames: string[] | undefined): void {
	if (!hiddenMeshNames?.length) {
		return
	}

	const hidden = new Set(hiddenMeshNames)
	model.traverse((object) => {
		if (hidden.has(object.name)) {
			object.visible = false
		}
	})
}

/** Loads a device GLB from {@link deviceDefinitions}. */
async function loadDeviceModel(deviceId: DeviceId): Promise<THREE.Group> {
	const device = deviceDefinitions[deviceId]
	const glbRelativePath = path.join('src/assets/devices', device.glbFileName)
	const loader = createGltfLoader()
	const gltf = await loader.parseAsync(
		readGlb(glbRelativePath),
		`${path.join(process.cwd(), path.dirname(glbRelativePath))}/`,
	)

	const model = gltf.scene.clone(true)
	hideDeviceMeshes(model, device.hiddenMeshNames)
	tintFrameMaterials(model, device)
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
