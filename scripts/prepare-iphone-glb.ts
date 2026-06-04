#!/usr/bin/env tsx
/**
 * Validates the downloaded iPhone 17 Pro assets are present for mockup rendering.
 *
 * Textures are loaded from `src/assets/devices/iphone-17-pro/textures/` at render time.
 *
 * @example
 * ```bash
 * npm run prepare:iphone-glb
 * ```
 */
import { accessSync } from 'node:fs'
import path from 'node:path'

async function main(): Promise<void> {
	const glbPath = path.join(
		process.cwd(),
		'src/assets/devices/iphone-17-pro/source/iPhone 17 Pro.glb',
	)
	const texturesPath = path.join(process.cwd(), 'src/assets/devices/iphone-17-pro/textures')

	accessSync(glbPath)
	accessSync(texturesPath)
	console.log('iPhone 17 Pro model assets found.')
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
