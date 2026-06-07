import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { MockupPreset } from './types'

const presetCache = new Map<string, MockupPreset>()

/**
 * Loads a named camera/rotation preset from `src/mockup/presets/{name}.json`.
 * Results are cached for the lifetime of the process.
 *
 * @param name - File name without extension, e.g. `feature-leading`.
 */
export function loadPreset(name: string): MockupPreset {
	const cached = presetCache.get(name)
	if (cached) {
		return cached
	}

	const presetPath = path.join(process.cwd(), 'src/mockup/presets', `${name}.json`)
	const preset = JSON.parse(readFileSync(presetPath, 'utf8')) as MockupPreset
	presetCache.set(name, preset)
	return preset
}

/**
 * Merges import-query or CLI overrides onto a base preset.
 * Undefined override values are ignored so partial overrides do not wipe preset fields.
 *
 * @param preset - Base preset from {@link loadPreset}.
 * @param overrides - Query params such as `w`, `h`, `rotateY`, or `bg`.
 */
export function mergePreset(
	preset: MockupPreset,
	overrides: Partial<MockupPreset> & {
		rotationX?: number
		rotationY?: number
		rotationZ?: number
	},
): MockupPreset {
	const definedOverrides = Object.fromEntries(
		Object.entries(overrides).filter(([, value]) => value !== undefined),
	) as Partial<MockupPreset>

	return {
		...preset,
		...definedOverrides,
	}
}
