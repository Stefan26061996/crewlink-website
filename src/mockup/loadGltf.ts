import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Creates a Three.js GLTF loader for Node-side mockup rendering.
 * Call {@link installThreeNodePolyfills} before parsing GLB data.
 */
export function createGltfLoader(): GLTFLoader {
	return new GLTFLoader()
}
