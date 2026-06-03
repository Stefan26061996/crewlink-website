<script setup lang="ts">
	import OpenInAppPanel from '../components/OpenInAppPanel.vue'
	import { useDeepLinkOpen } from '../composables/useDeepLinkOpen'

	const { openHref, onOpenClick } = useDeepLinkOpen()
</script>

<template>
	<div class="main-content max-width">
		<OpenInAppPanel
			:open-href="openHref"
			@open-click="onOpenClick"
		/>
	</div>
</template>
