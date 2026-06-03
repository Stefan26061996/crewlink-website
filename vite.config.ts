import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { svgImportFix } from './src/vite-plugins/svgImportFix'

export default defineConfig({
	base: '/',
	plugins: [
		vue(),
		svgImportFix(),
		svgLoader({ defaultImport: 'component' }),
	],
	build: {
		outDir: 'dist',
	},
})
