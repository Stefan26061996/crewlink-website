<script setup lang="ts">
	import AppStoreButton from './AppStoreButton.vue'
	import Button from './Button.vue'
	import GooglePlayButton from './GooglePlayButton.vue'
	import HelpIcon from '../assets/icons/help.svg'

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
			Öffne diesen Link in der App um fortzufahren.<br />
			Falls du Crewlink noch nicht installiert hast, lade es unkompliziert herunter.
		</p>

		<div class="actions">
			<div class="ctas">
				<Button :href="openHref"
				        type="primary"
				        size="large"
				        class="open-button"
				        @click="emit('openClick', $event)">
					In App öffnen
				</Button>

				<Button :to="{ name: 'home' }"
				        type="secondary"
				        class="home-button">
					<template #icon>
						<HelpIcon />
					</template>

					Was ist Crewlink?
				</Button>
			</div>

			<div class="stores">
				<AppStoreButton />
				<GooglePlayButton />
			</div>
		</div>
	</section>
</template>

<style>
	.open-in-app-panel {
		box-sizing: border-box;
		text-align: center;
		padding: 64px 48px !important;

		h1 + p {
			margin-top: 16px;
		}

		.actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 32px;
			margin-top: 32px;

			.ctas {
				display: flex;
				flex-wrap: wrap;
				gap: 24px 16px;
				align-items: center;
				justify-content: center;
			}

			.open-button {
				font-weight: 800;
			}
		}

		.stores {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: flex-start;
			gap: 24px;
			margin-top: 32px;
			padding-top: 64px;
			border-top: 1px solid var(--container-border-color);
		}
	}
</style>
