<script setup lang="ts">
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	import Button from '../components/Button.vue'
	import AlertRhombus from '../assets/icons/alert-rhombus.svg'

	const route = useRoute()
	const platform = computed(() => route.query.platform as string | undefined)
	const code = computed(() => route.query.code as string | undefined)

	const inPlatform = computed(() => {
		if (platform.value === 'android') return 'im Play Store'
		if (platform.value === 'ios') return 'im App Store'

		return ''
	})

	const redeemUrl = computed(() => {
		if (platform.value === 'android') return `https://play.google.com/redeem?code=${code.value}`
		if (platform.value === 'ios') return `https://apps.apple.com/redeem?code=${code.value}`

		return ''
	})
</script>

<template>
	<div class="main-content max-width redeem-view" v-if="code">
		<p class="emoji">
			🎉 🎉 🎉
		</p>

		<h2>Code einlösen</h2>

		<p>
			<strong>Als Dank für deine Teilnahme am Testprogramm erhältst du einen lebenslangen Crewlink Pro-Zugang.</strong>
		</p>

		<p>
			Dein Code ist nur einmalig einlösbar. Bitte teile ihn nicht weiter. Um deinen Zugang nach dem Einlösen
			zu aktivieren, tippe auf "Wiederherstellen" innerhalb der App.
		</p>

		<div class="warning" v-if="platform === 'ios'">
			<AlertRhombus class="icon" />

			<p>
				Um den Code aktivieren zu können, benötigst du die App Store-Version von Crewlink, <strong>nicht die Testflight-Version</strong>.
			</p>
		</div>

		<p class="secondary info">
			Klicke auf den Button, um deinen Code {{ inPlatform }} einzulösen.
		</p>

		<p class="secondary info">
			Dein Code: <code>{{ code }}</code> 
		</p>

		<div class="actions">
			<Button :href="redeemUrl" type="primary" class="redeem-button" size="large">
				Code einlösen
			</Button>
		</div>
	</div>

	<div class="main-content max-width redeem-view" v-else>
		<h2>Code einlösen</h2>

		<p>
			Der Code ist nicht gültig. Bitte versuche es erneut.
		</p>
	</div>
</template>

<style>
	.redeem-view {
		background: oklch(from var(--page-background) calc(l * 0.7) calc(c * 0.9) h);
		padding: 32px;
		margin: 32px auto;
		border-radius: var(--container-border-radius);
		max-width: 480px;

		.emoji {
			font-size: 3rem;
			letter-spacing: -0.05em;
		}

		h2 {
			font-size: 2rem;
			margin-bottom: 8px;
		}

		code {
			font-family: monospace;
		}

		p {
			font-size: 1rem;

			& + p {
				margin-top: 8px;
			}

			&.info {
				font-size: 0.9rem;
			}
		}

		.warning {
			--background: oklch(from var(--page-background) calc(l * 2.6) calc(c * 0.8) h);

			background: var(--background);
			color: var(--primary-color);
			
			padding: 12px 16px;
			border-radius: var(--container-border-radius);

			margin: 24px 0px;

			display: flex;
			align-items: flex-start;
			gap: 8px;

			svg {
				width: 24px;
				height: 24px;

				path {
					fill: currentColor;
				}
			}

			p {
				flex: 1;
			}
		}

		.actions {
			margin-top: 32px;
			text-align: center;
		}
	}
</style>