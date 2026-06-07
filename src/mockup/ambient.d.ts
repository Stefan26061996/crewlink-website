/// <reference types="vite/client" />

interface DeviceMockupMeta {
	src: string
	width: number
	height: number
}

declare module '*?mockup=*' {
	const meta: DeviceMockupMeta
	export default meta
}

declare module 'draco3dgltf' {
	const draco3d: {
		createDecoderModule: () => Promise<unknown>
		createEncoderModule: () => Promise<unknown>
	}
	export default draco3d
}
