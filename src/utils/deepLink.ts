import type { ParsedDeepLink } from '../types/deepLink'

export function parseDeepLinkPath(pathname: string): ParsedDeepLink {
	const profile = pathname.match(/^\/@([^/]+)$/)
	if (profile) return { type: 'profile', id: profile[1] }

	const event = pathname.match(/^\/events\/([^/]+)$/)
	if (event) return { type: 'event', id: event[1] }

	const listing = pathname.match(/^\/listings\/([^/]+)$/)
	if (listing) return { type: 'listing', id: listing[1] }

	return { type: 'unknown', id: '' }
}

export function isAndroidUserAgent(ua: string): boolean {
	return /android/i.test(ua)
}

export function isIosUserAgent(ua: string): boolean {
	return /iphone|ipad|ipod/i.test(ua)
}

export const IOS_APP_SCHEME = 'crewlink' as const

export function buildIosAppUrl(path: string): string {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	const params = new URLSearchParams({ path: normalizedPath })
	return `${IOS_APP_SCHEME}://open?${params.toString()}`
}

export function buildAndroidIntentUrl(params: {
	path: string
	host: string
	httpsUrl: string
	package: string
}): string {
	const hostPath = `${params.host}${params.path}`
	const fallback = encodeURIComponent(params.httpsUrl)
	return `intent://${hostPath}#Intent;scheme=https;package=${params.package};S.browser_fallback_url=${fallback};end`
}
