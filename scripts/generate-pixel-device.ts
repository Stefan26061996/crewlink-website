#!/usr/bin/env tsx
/**
 * Generates a lightweight Pixel 8 Pro-style GLB with a dedicated `Screen` mesh.
 *
 * Output: `src/assets/devices/pixel-8-pro.glb`
 *
 * The screen plane faces +Z so it aligns with the mockup camera presets.
 * Re-run after changing geometry; then clear `node_modules/.cache/device-mockup/`.
 *
 * @example
 * ```bash
 * npm run generate:pixel-device
 * ```
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { installThreeNodePolyfills } from '../src/mockup/nodePolyfills'

async function main(): Promise<void> {
	installThreeNodePolyfills()

	const group = new THREE.Group()
	group.name = 'Pixel8Pro'

	const bodyWidth = 0.076
	const bodyHeight = 0.162
	const bodyDepth = 0.0085

	const bodyGeometry = new RoundedBoxGeometry(bodyWidth, bodyHeight, bodyDepth, 8, 0.012)
	const bodyMaterial = new THREE.MeshStandardMaterial({
		color: 0x2a2a2e,
		metalness: 0.85,
		roughness: 0.32,
	})
	const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
	body.name = 'Body'
	group.add(body)

	const screenGeometry = new THREE.PlaneGeometry(0.068, 0.148)
	const screenMaterial = new THREE.MeshStandardMaterial({
		color: 0x111111,
		roughness: 0.25,
		metalness: 0,
	})
	const screen = new THREE.Mesh(screenGeometry, screenMaterial)
	screen.name = 'Screen'
	screen.position.z = bodyDepth / 2 + 0.0002
	group.add(screen)

	const barGeometry = new RoundedBoxGeometry(0.028, 0.012, 0.0025, 4, 0.003)
	const barMaterial = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		metalness: 0.7,
		roughness: 0.4,
	})
	const cameraBar = new THREE.Mesh(barGeometry, barMaterial)
	cameraBar.name = 'CameraBar'
	cameraBar.position.set(0, bodyHeight * 0.28, -(bodyDepth / 2 + 0.001))
	group.add(cameraBar)

	const exporter = new GLTFExporter()
	const arrayBuffer = (await exporter.parseAsync(group, { binary: true })) as ArrayBuffer
	const outputPath = path.join(process.cwd(), 'src/assets/devices/pixel-8-pro.glb')
	writeFileSync(outputPath, Buffer.from(arrayBuffer))
	console.log(`Wrote ${outputPath}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
