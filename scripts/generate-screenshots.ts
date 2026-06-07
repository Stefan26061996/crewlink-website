#!/usr/bin/env tsx
/**
 * Creates placeholder app screenshots until real Flutter captures are added.
 *
 * Generates four 1170×2532 PNGs in `src/assets/screenshots/` from SVG templates
 * via `sharp`. Replace these files with real app exports when available.
 *
 * @example
 * ```bash
 * npm run generate:screenshots
 * ```
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const screenshotsDir = path.join(process.cwd(), 'src/assets/screenshots')

/** Placeholder screenshot definitions (file name, copy, and colors). */
const screenshots = [
	{
		fileName: 'search-helpers.png',
		title: 'Helfer finden',
		subtitle: 'Equipment &amp; Personal',
		background: '#1b2a41',
		accent: '#5b8def',
	},
	{
		fileName: 'trust-score.png',
		title: 'Vertrauensscore',
		subtitle: 'Zuverlässigkeit prüfen',
		background: '#241f33',
		accent: '#9b7bff',
	},
	{
		fileName: 'find-events.png',
		title: 'Events finden',
		subtitle: 'Hilfe anbieten',
		background: '#1f2f28',
		accent: '#4ecf8f',
	},
	{
		fileName: 'plan-help.png',
		title: 'Hilfe planen',
		subtitle: 'Verfügbarkeit',
		background: '#2a241f',
		accent: '#f0a45c',
	},
] as const

mkdirSync(screenshotsDir, { recursive: true })

for (const screenshot of screenshots) {
	const width = 1170
	const height = 2532
	const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${screenshot.background}" />
      <stop offset="100%" stop-color="#0f1115" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect x="72" y="180" width="1026" height="220" rx="36" fill="${screenshot.accent}" opacity="0.18" />
  <text x="96" y="290" fill="#ffffff" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700">${screenshot.title}</text>
  <text x="96" y="360" fill="#d7dbe3" font-family="Helvetica, Arial, sans-serif" font-size="42">${screenshot.subtitle}</text>
  <rect x="72" y="520" width="1026" height="1600" rx="48" fill="#ffffff" opacity="0.08" />
  <rect x="120" y="580" width="930" height="120" rx="24" fill="#ffffff" opacity="0.12" />
  <rect x="120" y="740" width="930" height="120" rx="24" fill="#ffffff" opacity="0.12" />
  <rect x="120" y="900" width="930" height="120" rx="24" fill="#ffffff" opacity="0.12" />
  <rect x="120" y="1060" width="930" height="120" rx="24" fill="#ffffff" opacity="0.12" />
  <text x="96" y="2400" fill="#8f96a3" font-family="Helvetica, Arial, sans-serif" font-size="34">Crewlink Screenshot Placeholder</text>
</svg>`

	const png = await sharp(Buffer.from(svg)).png().toBuffer()
	const outputPath = path.join(screenshotsDir, screenshot.fileName)
	writeFileSync(outputPath, png)
	console.log(`Wrote ${outputPath}`)
}
