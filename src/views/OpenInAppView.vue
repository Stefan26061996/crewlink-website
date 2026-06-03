<script setup lang="ts">
import OpenInAppPanel from '../components/OpenInAppPanel.vue'
import { STORE_ANDROID_URL, STORE_IOS_URL } from '../config/links'
import { useDeepLinkOpen } from '../composables/useDeepLinkOpen'

const { openHref, onOpenClick } = useDeepLinkOpen()
</script>

<template>
	<OpenInAppPanel
		:open-href="openHref"
		:store-ios-url="STORE_IOS_URL"
		:store-android-url="STORE_ANDROID_URL"
		@open-click="onOpenClick"
	/>
</template>
