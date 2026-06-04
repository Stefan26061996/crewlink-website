/** Supported device identifiers for mockup imports and CLI flags. */
export type DeviceId = 'iphone17pro' | 'pixel8pro'

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
	/** GLB path relative to `src/assets/devices/`. */
	glbFileName: string
	/** Mesh name that receives the screenshot texture. */
	screenMeshName: string
	/** Mesh names hidden before rendering (duplicate screen layers, etc.). */
	hiddenMeshNames?: string[]
	/** GLB material names to tint toward {@link frameTintColor}. */
	frameMaterialNames?: string[]
	/** Target hue for the device frame (e.g. site primary). Blended via {@link frameTintMix}. */
	frameTintColor?: number
	/** 0 = model default, 1 = full {@link frameTintColor}. Use ~0.25–0.35 for a subtle brand hint. */
	frameTintMix?: number
	/** Antenna lines, SIM tray, etc. — tinted like the frame then lightened slightly. */
	frameAccentMaterialNames?: string[]
	/** Blend toward white after accent tint (e.g. 0.08 = slightly lighter than frame). */
	frameAccentLighten?: number
	/** @deprecated Use {@link frameTintColor}. Kept for Pixel procedural body color. */
	bodyColor: number
	/** Corrects GLB authoring orientation so presets match across devices (degrees). */
	modelRotationX?: number
	modelRotationY?: number
	modelRotationZ?: number
	/** How strongly the screenshot glows as a display (0 = lit only by scene lights). */
	screenEmissiveIntensity?: number
	/** Radians to rotate the screenshot on the screen mesh UVs (e.g. Math.PI when the GLB is Y-flipped). */
	screenTextureRotation?: number
	/** When true, render the inward-facing screen plane (needed for some GLBs flipped with modelRotationY). */
	screenMaterialBackFace?: boolean
	license: string
	sourceUrl: string
}
