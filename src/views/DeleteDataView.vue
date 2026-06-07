<script setup lang="ts">
	import Button from '../components/Button.vue'
	import ArrowLeft from '../assets/icons/arrows/left.svg'
</script>

<template>
	<nav class="toolbar" aria-label="Seitennavigation">
		<div class="toolbar-content max-width">
			<Button :to="{ name: 'home' }" class="back-button" type="primary">
				<template #icon>
					<ArrowLeft />
				</template>

				Zurück zur Startseite
			</Button>
		</div>
	</nav>

	<div class="main-content max-width crewlink-delete-data-view">
		<h1>Löschung meiner Daten bei Crewlink</h1>
		<p class="document-date secondary"><em>Stand: Juni 2026</em></p>

		<section class="text-content">
			<p>Wenn du dein Crewlink-Konto löschen und alle deine Daten entfernen lassen möchtest, sende bitte eine E-Mail an:</p>

			<p class="email">
				<a href="mailto:hallo@crewlink.cloud">hallo@crewlink.cloud</a>
			</p>

			<p>mit folgendem Inhalt:</p>

			<ul>
				<li><strong>Betreff:</strong> "Löschung meiner Daten"</li>
				<li><strong>Deine bei Crewlink registrierte E-Mail-Adresse</strong></li>
			</ul>

			<p>Wir werden deine Daten innerhalb von <strong>30 Tagen</strong> vollständig aus unserer Datenbank entfernen und dir eine Bestätigung zusenden.</p>

			<hr />

			<p>Du kannst dein Konto auch direkt in der App unter "Einstellungen" → "Konto löschen" selbst entfernen.</p>
		</section>
	</div>
</template>

<style>
	.crewlink-delete-data-view {

		.email {
			background: oklch(from var(--page-background) calc(l * 0.7) calc(c * 0.9) h);
			text-align: center;
			padding: 16px 16px;
			border-radius: var(--container-border-radius);

			a {
				text-decoration: none;
				font-family: monospace;
			}
		}
	}
</style>
