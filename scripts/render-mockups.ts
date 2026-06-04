#!/usr/bin/env tsx
/**
 * CLI for rendering a single device mockup outside Vite.
 *
 * Used directly for preview/tuning and invoked as a subprocess by the
 * {@link ../src/vite-plugins/deviceMockup.ts} plugin during dev/build.
 *
 * Writes the image and a sidecar `{output}.meta.json` with dimensions.
 *
 * @example
 * ```bash
 * npm run render-mockups -- \
 *   --screenshot src/assets/screenshots/app.png \
 *   --device iphone15 \
 *   --preset feature-leading \
 *   --width 600 \
 *   --output /tmp/preview.webp
 * ```
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { resolveDeviceId } from '../src/mockup/devices'
import { loadPreset, mergePreset } from '../src/mockup/presets'
import { renderMockup } from '../src/mockup/mockupScene'

const args = process.argv.slice(2)

/** Reads a string CLI flag value (`--name value`). */
function readArg(name: string): string | undefined {
	const index = args.indexOf(name)
	if (index === -1) {
		return undefined
	}

	return args[index + 1]
}

/** Reads an integer CLI flag value; returns `undefined` when absent or invalid. */
function readNumberArg(name: string): number | undefined {
	const value = readArg(name)
	if (!value) {
		return undefined
	}

	const parsed = Number.parseInt(value, 10)
	return Number.isFinite(parsed) ? parsed : undefined
}

const screenshotPath = readArg('--screenshot')
const deviceId = resolveDeviceId(readArg('--device') ?? 'iphone15')
const presetName = readArg('--preset') ?? 'feature-leading'
const outputPath =
	readArg('--output') ??
	path.join(process.cwd(), 'node_modules/.cache/device-mockup/preview.webp')

if (!screenshotPath) {
	console.error(
		'Usage: npm run render-mockups -- --screenshot src/assets/screenshots/search-helpers.png [--device iphone15|pixel8pro] [--preset feature-leading] [--width 600] [--height 600] [--output path.webp]',
	)
	process.exit(1)
}

const preset = mergePreset(loadPreset(presetName), {
	width: readNumberArg('--width'),
	height: readNumberArg('--height'),
	background: readArg('--background'),
	rotationX: readNumberArg('--rotateX'),
	rotationY: readNumberArg('--rotateY'),
	rotationZ: readNumberArg('--rotateZ'),
})

const format = outputPath.endsWith('.png') ? 'png' : 'webp'
const rendered = await renderMockup({
	screenshotPath: path.resolve(screenshotPath),
	deviceId,
	preset,
	width: preset.width,
	height: preset.height,
	format,
	background: preset.background,
	rotationX: preset.rotationX,
	rotationY: preset.rotationY,
	rotationZ: preset.rotationZ,
})

mkdirSync(path.dirname(outputPath), { recursive: true })
writeFileSync(outputPath, rendered.data)
writeFileSync(
	`${outputPath}.meta.json`,
	JSON.stringify({
		width: rendered.width,
		height: rendered.height,
		format: rendered.format,
	}),
)
console.log(`Wrote ${outputPath} (${rendered.width}x${rendered.height})`)
