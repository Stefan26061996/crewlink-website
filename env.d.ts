/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.svg' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent
	export default component
}

declare module '*.svg?component' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent
	export default component
}

interface ImportMetaEnv {
	readonly BASE_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
