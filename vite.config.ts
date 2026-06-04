import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import svgLoader from 'vite-svg-loader'
import { deviceMockup } from './src/vite-plugins/deviceMockup'
import { svgImportFix } from './src/vite-plugins/svgImportFix'

export default defineConfig({
	base: '/',
	plugins: [
		deviceMockup(),
		vue(),
		svgImportFix(),
		svgLoader({ defaultImport: 'component' }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: 'dist',
	},
	ssr: {
		noExternal: ['three'],
	},
	server: {
		port: 7100,
	}
})
