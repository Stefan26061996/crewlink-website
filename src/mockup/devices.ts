import type { DeviceDefinition, DeviceId } from './types'

/**
 * Registry of device models available to the mockup renderer and Vite plugin.
 *
 * Import query `mockup=` values map to these keys (`iphone15`, `pixel8pro`).
 */
export const deviceDefinitions: Record<DeviceId, DeviceDefinition> = {
	iphone15: {
		id: 'iphone15',
		glbFileName: 'iphone-15-pro.glb',
		screenMeshName: 'xXDHkMplTIDAXLN',
		bodyColor: 0x3b3b3d,
		modelRotationY: 180,
		screenEmissiveIntensity: 0.5,
		license: 'CC-BY-4.0 — Polyman / Sketchfab (iPhone 15 Pro Max)',
		sourceUrl:
			'https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7',
	},
	pixel8pro: {
		id: 'pixel8pro',
		glbFileName: 'pixel-8-pro.glb',
		screenMeshName: 'Screen',
		bodyColor: 0x2a2a2e,
		screenEmissiveIntensity: 0.6,
		license: 'Generated in-repo procedural model for Crewlink marketing',
		sourceUrl: 'https://crewlink.cloud',
	},
}

/**
 * iPhone GLB material names that represent screen glass or lens elements.
 * Skipped during body tinting; opacity is reduced separately so emissive shows through.
 */
export const screenMaterialKeysToSkip = new Set([
	'zFdeDaGNRwzccye',
	'ujsvqBWRMnqdwPx',
	'hUlRcbieVuIiOXG',
	'jlzuBkUzuJqgiAK',
	'xNrofRCqOXXHVZt',
])

/**
 * Resolves a mockup import query or CLI flag to a {@link DeviceId}.
 *
 * @param value - Raw device string from `?mockup=` or `--device`.
 * @throws When the value is not a known device id.
 */
export function resolveDeviceId(value: string): DeviceId {
	if (value === 'iphone15' || value === 'pixel8pro') {
		return value
	}

	throw new Error(`Unknown mockup device "${value}". Expected iphone15 or pixel8pro.`)
}
