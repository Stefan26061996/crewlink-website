/** Supported device identifiers for mockup imports and CLI flags. */
export type DeviceId = 'iphone15' | 'pixel8pro'

/**
 * Camera, rotation, and output settings loaded from `src/mockup/presets/*.json`.
 * Angles are in degrees; dimensions are pixels.
 */
export type MockupPreset = {
	/** Pitch — tilt forward/back. */
	rotationX: number
	/** Yaw — turn left/right; leading/trailing presets mirror this value. */
	rotationY: number
	/** Roll — rotate around the screen normal. */
	rotationZ: number
	/** Perspective camera field of view. */
	cameraFov: number
	/** Multiplier applied to bounding-box size for camera distance. */
	cameraDistanceFactor: number
	/** Vertical camera offset as a fraction of model height. */
	cameraYOffsetFactor: number
	/** Horizontal camera offset as a fraction of camera distance. */
	cameraXOffsetFactor: number
	/** Output width in pixels. */
	width: number
	/** Output height in pixels. */
	height: number
	/** `"transparent"` or a hex color without `#`. */
	background: string
}

/** Options passed to {@link renderMockup}. */
export type MockupRenderOptions = {
	/** Absolute or cwd-relative path to the app screenshot PNG/JPEG/WebP. */
	screenshotPath: string
	deviceId: DeviceId
	preset: MockupPreset
	width?: number
	height?: number
	format?: 'webp' | 'png'
	background?: string
	rotationX?: number
	rotationY?: number
	rotationZ?: number
}

/** Raw image buffer returned by {@link renderMockup}. */
export type MockupRenderResult = {
	data: Buffer
	width: number
	height: number
	format: 'webp' | 'png'
}

/**
 * Static metadata for a 3D device model used at build/render time.
 * See {@link deviceDefinitions} for the canonical registry.
 */
export type DeviceDefinition = {
	id: DeviceId
	/** GLB file name inside `src/assets/devices/`. */
	glbFileName: string
	/** Mesh name that receives the screenshot texture. */
	screenMeshName: string
	/** Body tint applied to non-screen materials (iPhone only). */
	bodyColor: number
	/** Corrects GLB authoring orientation so presets match across devices (degrees). */
	modelRotationX?: number
	modelRotationY?: number
	modelRotationZ?: number
	/** How strongly the screenshot glows as a display (0 = lit only by scene lights). */
	screenEmissiveIntensity?: number
	license: string
	sourceUrl: string
}
