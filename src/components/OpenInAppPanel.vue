<script setup lang="ts">
defineProps<{
	openHref: string
	storeIosUrl: string
	storeAndroidUrl: string
}>()

const emit = defineEmits<{
	openClick: [event: MouseEvent]
}>()
</script>

<template>
	<main id="open-in-app">
		<p id="fallback-message">Open in Crewlink</p>
		<a
			id="open-same-url"
			:href="openHref"
			@click="emit('openClick', $event)"
		>Open in app</a>
		<a id="store-ios" :href="storeIosUrl">App Store</a>
		<a id="store-android" :href="storeAndroidUrl">Google Play</a>
	</main>
</template>
