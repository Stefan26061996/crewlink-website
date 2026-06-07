#!/usr/bin/env tsx
import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import { createGltfLoader } from '../src/mockup/loadGltf'
import { installThreeNodePolyfills } from '../src/mockup/nodePolyfills'

async function main(): Promise<void> {
	installThreeNodePolyfills()

	const glbPath = path.join(
		process.cwd(),
		'src/assets/devices/iphone-17-pro/source/iPhone 17 Pro.glb',
	)
	const buffer = readFileSync(glbPath)
	const loader = createGltfLoader()
	const gltf = await loader.parseAsync(
		buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
		path.dirname(glbPath) + '/',
	)

	const scene = gltf.scene
	scene.updateMatrixWorld(true)

	const rows: Array<Record<string, unknown>> = []
	scene.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) {
			return
		}

		const box = new THREE.Box3().setFromObject(object)
		const materials = Array.isArray(object.material) ? object.material : [object.material]
		rows.push({
			name: object.name,
			min: {
				x: +box.min.x.toFixed(4),
				y: +box.min.y.toFixed(4),
				z: +box.min.z.toFixed(4),
			},
			max: {
				x: +box.max.x.toFixed(4),
				y: +box.max.y.toFixed(4),
				z: +box.max.z.toFixed(4),
			},
			materials: materials.map((material) => ({
				name: material.name,
				uuid: material.uuid.slice(0, 8),
			})),
			groups: object.geometry.groups?.map((group) => ({
				start: group.start,
				count: group.count,
				materialIndex: group.materialIndex,
			})),
		})
	})

	for (const row of rows) {
		console.log(JSON.stringify(row, null, 2))
	}

	console.log('\nScene graph:')
	function walk(object: THREE.Object3D, depth = 0): void {
		const meshTag = object instanceof THREE.Mesh ? ` [Mesh]` : ''
		const pos = object.position.toArray().map((value) => value.toFixed(3)).join(',')
		console.log(`${' '.repeat(depth * 2)}${object.name}${meshTag} pos=${pos}`)
		for (const child of object.children) {
			walk(child, depth + 1)
		}
	}
	walk(scene)
}

main().catch(console.error)
