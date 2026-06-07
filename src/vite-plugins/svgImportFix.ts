import type { Plugin } from 'vite'

/**
 * Vite 6 appends `?import` to SVG asset imports. vite-svg-loader only handles
 * `?component`, `?url`, `?raw`, and `?skipsvgo`, so rewrite `?import` → `?component`.
 */
export function svgImportFix(): Plugin {
  return {
    name: 'svg-import-fix',
    enforce: 'pre',
    resolveId(source) {
      if (source.endsWith('.svg?import')) {
        return source.replace(/\.svg\?import$/, '.svg?component')
      }
    },
  }
}
