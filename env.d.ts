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

interface DeviceMockupMeta {
	src: string
	width: number
	height: number
}

declare module '*?mockup=*' {
	const meta: DeviceMockupMeta
	export default meta
}

declare module '@/assets/screenshots/organizer-collaborations-ios-de.png?mockup=iphone17pro&preset=feature-leading&format=webp&w=600' {
	const meta: DeviceMockupMeta
	export default meta
}

declare module '@/assets/screenshots/trust-score-ios-de.png?mockup=iphone17pro&preset=feature-trailing&format=webp&w=600' {
	const meta: DeviceMockupMeta
	export default meta
}

declare module '@/assets/screenshots/feed-android-de.png?mockup=pixel8pro&preset=feature-leading&format=webp&w=600' {
	const meta: DeviceMockupMeta
	export default meta
}

declare module '@/assets/screenshots/collaboration-equipment-android-de.png?mockup=pixel8pro&preset=feature-trailing&format=webp&w=600' {
	const meta: DeviceMockupMeta
	export default meta
}

interface ImportMetaEnv {
	readonly BASE_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
