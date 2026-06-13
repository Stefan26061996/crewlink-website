<script setup lang="ts">
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	import Button from '../components/Button.vue'
	import AlertRhombus from '../assets/icons/alert-rhombus.svg'

	const route = useRoute()
	const platform = computed(() => route.query.platform as string | undefined)
	const code = computed(() => route.query.code as string | undefined)

	const redeemUrl = computed(() => {
		if (platform.value === 'android') return `https://play.google.com/redeem?code=${code.value}`
		if (platform.value === 'ios') return `https://apps.apple.com/redeem?ctx=offercodes&id=6766081864&code=${code.value}`

		return ''
	})

	const betaUrl = 'https://play.google.com/apps/testing/com.crewlink.eventify'
	const androidUrl = 'https://play.google.com/store/apps/details?id=com.crewlink.eventify'

	const copyCode = async () => {
		const value = code.value
		if (!value) return

		try {
			await navigator.clipboard.writeText(value)
		} catch {
			const textarea = document.createElement('textarea')
			textarea.value = value
			textarea.setAttribute('readonly', '')
			textarea.style.position = 'fixed'
			textarea.style.left = '-9999px'
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
		}
	}
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

		<template v-if="platform == 'ios'">
			<p>
				Dein Code ist nur einmalig einlösbar. Bitte teile ihn nicht weiter. Um deinen Zugang nach dem Einlösen
				zu aktivieren, tippe auf "Wiederherstellen" innerhalb der App.
			</p>

			<div class="warning">
				<AlertRhombus class="icon" />

				<p>
					Um den Code aktivieren zu können, benötigst du die App Store-Version von Crewlink, <strong>nicht die Testflight-Version</strong>.
				</p>
			</div>

			<p class="secondary info">
				Klicke auf den Button, um deinen Code im App Store einzulösen.
			</p>
		</template>

		<template v-else-if="platform == 'android'">
			<p>
				Dein Code ist nur einmalig einlösbar. Bitte teile ihn nicht weiter.
			</p>

			<p>
				Um deinen Code einzulösen, befolge diese Schritte:
			</p>

			<ol>
				<li><a :href="betaUrl" target="_blank">Tritt dem öffentlichen Beta-Test von Crewlink bei</a> oder <a :href="androidUrl">installiere die Release-Version aus dem Play Store</a>.</li>
				<li>Kopiere den Code von dieser Seite (siehe unten).</li>
				<li>Öffne die Crewlink-App, öffne dein Profil und tippe auf den Button zum Kaufen von Crewlink Pro.</li>
				<li>Wähle "Lifetime Pro" und tippe auf "Kostenpflichtig kaufen".</li>
				<li>In dem erscheinenden Dialog, tippe auf den Pfeil neben deiner Zahlungsmethode.</li>
				<li>Tippe auf "Code einlösen".</li>
				<li>Füge den kopierten Code in das Feld ein und löse ihn ein.</li>
			</ol>

			<div class="warning">
				<AlertRhombus class="icon" />

				<p>
					Falls du einen Testkauf siehst, bist du noch im internen Test. Deinstalliere die App,
					<a :href="betaUrl" target="_blank">tritt dem Beta-Test bei</a> und installiere die App erneut.
				</p>
			</div>
		</template>

		<p class="secondary info">
			Dein Code: <code>{{ code }}</code>
		</p>

		<div class="actions">
			<Button :href="redeemUrl" type="primary" class="redeem-button" size="large" v-if="platform == 'ios'">
				Code einlösen
			</Button>

			<Button :href="betaUrl"
			        type="primary"
			        class="beta-button"
			        v-if="platform == 'android'">
				Beta beitreten
			</Button>

			<Button @click="copyCode" type="primary" class="redeem-button" size="large" v-if="platform == 'android'">
				Code kopieren
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

		ol {
			list-style-type: decimal;
			margin-left: 20px;

			li {
				padding-left: 8px;

				&::marker {
					font-weight: 700;
				}

				& + li {
					margin-top: 16px;
				}
			}

			p + &,
			& + p {
				margin-top: 16px;
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

			a {
				color: inherit;
				font-weight: 600;
			}
		}

		.actions {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 16px;

			margin-top: 32px;
			text-align: center;
		}
	}
</style>
