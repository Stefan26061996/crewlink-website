import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ANDROID_PACKAGE, CANONICAL_ORIGIN, STORE_IOS_URL } from '../config/links'
import {
	buildAndroidIntentUrl,
	buildIosAppUrl,
	isAndroidUserAgent,
	isIosUserAgent,
	parseDeepLinkPath,
} from '../utils/deepLink'

const IOS_APP_OPEN_FALLBACK_MS = 1500

export function useDeepLinkOpen() {
	const route = useRoute()

	const pathname = computed(() => route.path || '/')
	const httpsUrl = computed(() =>
		typeof window !== 'undefined' ? window.location.href : '',
	)
	const parsed = computed(() => parseDeepLinkPath(pathname.value))

	const linkType = computed(() => parsed.value.type)
	const linkId = computed(() => parsed.value.id)
	const canonicalUrl = computed(
		() => `${CANONICAL_ORIGIN}${pathname.value}`,
	)

	const isAndroid = computed(() =>
		typeof navigator !== 'undefined'
			? isAndroidUserAgent(navigator.userAgent)
			: false,
	)

	const isIos = computed(() =>
		typeof navigator !== 'undefined'
			? isIosUserAgent(navigator.userAgent)
			: false,
	)

	const openHref = computed(() => {
		if (typeof window === 'undefined') return httpsUrl.value
		if (isAndroid.value) {
			return buildAndroidIntentUrl({
				path: pathname.value,
				host: window.location.host,
				httpsUrl: httpsUrl.value,
				package: ANDROID_PACKAGE,
			})
		}
		if (isIos.value) return buildIosAppUrl(pathname.value)
		return httpsUrl.value
	})

	function openIosApp() {
		window.location.assign(buildIosAppUrl(pathname.value))
		window.setTimeout(() => {
			if (document.hidden) return
			window.location.assign(STORE_IOS_URL)
		}, IOS_APP_OPEN_FALLBACK_MS)
	}

	function onOpenClick(event: MouseEvent) {
		if (typeof window === 'undefined') return

		if (isAndroid.value) {
			event.preventDefault()
			window.location.assign(
				buildAndroidIntentUrl({
					path: pathname.value,
					host: window.location.host,
					httpsUrl: httpsUrl.value,
					package: ANDROID_PACKAGE,
				}),
			)
			return
		}

		if (isIos.value) {
			event.preventDefault()
			openIosApp()
		}
	}

	return {
		linkType,
		linkId,
		canonicalUrl,
		openHref,
		onOpenClick,
	}
}
