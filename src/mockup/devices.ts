import type { DeviceDefinition, DeviceId } from './types'

/** Matches `--primary-color` in `src/App.vue`. */
export const brandPrimaryColor = 0x1a237e

/**
 * Registry of device models available to the mockup renderer and Vite plugin.
 *
 * Import query `mockup=` values map to these keys (`iphone17pro`, `pixel8pro`).
 */
export const deviceDefinitions: Record<DeviceId, DeviceDefinition> = {
	iphone17pro: {
		id: 'iphone17pro',
		glbFileName: 'iphone-17-pro/source/iPhone 17 Pro.glb',
		screenMeshName: 'iPhone_17_Pro004_4',
		hiddenMeshNames: ['iPhone_17_Pro004_3', 'iPhone_17_Pro004_2'],
		frameMaterialNames: ['Anodized aluminum'],
		frameAccentMaterialNames: ['Plastic antena', 'Plastic port'],
		frameAccentLighten: 0.03,
		frameTintColor: brandPrimaryColor,
		frameTintMix: 0.67,
		bodyColor: 0x3b3b3d,
		// Downloaded model screen faces -Z; rotate 180° to face the mockup camera (+Z).
		modelRotationY: 180,
		screenEmissiveIntensity: 0.65,
		screenTextureRotation: Math.PI,
		screenMaterialBackFace: true,
		license: 'User-provided iPhone 17 Pro model (see src/assets/devices/iphone-17-pro/)',
		sourceUrl: 'https://crewlink.cloud',
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
 * Resolves a mockup import query or CLI flag to a {@link DeviceId}.
 *
 * @param value - Raw device string from `?mockup=` or `--device`.
 * @throws When the value is not a known device id.
 */
export function resolveDeviceId(value: string): DeviceId {
	if (value === 'iphone17pro' || value === 'pixel8pro') {
		return value
	}

	throw new Error(`Unknown mockup device "${value}". Expected iphone17pro or pixel8pro.`)
}
