<script setup lang="ts">
	import AppStoreButton from './AppStoreButton.vue'
	import Button from './Button.vue'
	import GooglePlayButton from './GooglePlayButton.vue'

	defineProps<{
		openHref: string
	}>()

	const emit = defineEmits<{
		openClick: [event: MouseEvent]
	}>()
</script>

<template>
	<section class="text-content open-in-app-panel">
		<h1>In Crewlink öffnen</h1>

		<p class="secondary">
			Öffne diesen Link in der App oder lade Crewlink aus dem App Store bzw. Google Play.
		</p>

		<div class="open-in-app-panel__actions">
			<Button
				:href="openHref"
				type="primary"
				size="large"
				class="open-button"
				@click="emit('openClick', $event)"
			>
				In App öffnen
			</Button>

			<div class="open-in-app-panel__stores">
				<AppStoreButton />
				<GooglePlayButton />
			</div>
		</div>
	</section>
</template>

<style>
	.open-in-app-panel {
		text-align: center;

		h1 + p {
			margin-top: 16px;
		}
	}

	.open-in-app-panel__actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
		margin-top: 32px;

		.open-button {
			font-weight: 800;
		}
	}

	.open-in-app-panel__stores {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		gap: 24px;
	}
</style>
