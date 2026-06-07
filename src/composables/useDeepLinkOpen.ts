import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ANDROID_PACKAGE, CANONICAL_ORIGIN } from '../config/links'
import {
	buildAndroidIntentUrl,
	isAndroidUserAgent,
	parseDeepLinkPath,
} from '../utils/deepLink'

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

	const openHref = computed(() => {
		if (typeof window === 'undefined') return httpsUrl.value
		if (!isAndroid.value) return httpsUrl.value
		return buildAndroidIntentUrl({
			path: pathname.value,
			host: window.location.host,
			httpsUrl: httpsUrl.value,
			package: ANDROID_PACKAGE,
		})
	})

	function onOpenClick(event: MouseEvent) {
		if (!isAndroid.value || typeof window === 'undefined') return
		event.preventDefault()
		window.location.assign(
			buildAndroidIntentUrl({
				path: pathname.value,
				host: window.location.host,
				httpsUrl: httpsUrl.value,
				package: ANDROID_PACKAGE,
			}),
		)
	}

	return {
		linkType,
		linkId,
		canonicalUrl,
		openHref,
		onOpenClick,
	}
}
