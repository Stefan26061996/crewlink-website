#!/usr/bin/env tsx
/**
 * Preprocesses the iPhone 15 Pro GLB for headless Three.js loading.
 *
 * - Decodes Draco-compressed meshes (avoids DRACOLoader workers in Node)
 * - Converts WebP embedded textures to PNG (better Node/sharp compatibility)
 *
 * Overwrites `src/assets/devices/iphone-15-pro.glb` in place.
 * Re-run after downloading a fresh Sketchfab export.
 *
 * @example
 * ```bash
 * npm run prepare:iphone-glb
 * ```
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { KHRDracoMeshCompression, EXTTextureWebP } from '@gltf-transform/extensions'
import { textureCompress } from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import sharp from 'sharp'

async function main(): Promise<void> {
	const inputPath = path.join(process.cwd(), 'src/assets/devices/iphone-15-pro.glb')
	const readIo = new NodeIO()
		.registerExtensions([KHRDracoMeshCompression, EXTTextureWebP])
		.registerDependencies({
			'draco3d.decoder': await draco3d.createDecoderModule(),
			'draco3d.encoder': await draco3d.createEncoderModule(),
		})

	const writeIo = new NodeIO().registerExtensions([EXTTextureWebP])

	const document = await readIo.read(inputPath)
	await document.transform(
		textureCompress({
			encoder: sharp,
			targetFormat: 'png',
		}),
	)
	const glb = await writeIo.writeBinary(document)
	writeFileSync(inputPath, Buffer.from(glb))
	console.log(`Decoded Draco meshes in ${inputPath}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
