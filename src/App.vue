<template>
	<a class="skip-link" href="#main-content">Zum Inhalt springen</a>

	<header :class="['main-header', { bordered: !isDeepLink }]" v-if="!isHome">
		<div class="max-width">
			<div class="logo">
				<router-link :to="{ name: 'home' }"><img src="/images/logo-white.svg" alt="Crewlink" /></router-link>
			</div>
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<RouterView />
	</main>

	<footer class="main-footer">
		<div class="content max-width">
			<div class="copyright">
				&copy; {{ new Date().getFullYear() }} Crewlink
			</div>

			<nav aria-label="Rechtliches">
				<ul class="links">
					<li>
						<router-link :to="{ name: 'imprint' }">Impressum</router-link>
					</li>

					<li>
						<router-link :to="{ name: 'privacy-policy' }">Datenschutz</router-link>
					</li>

					<li>
						<router-link :to="{ name: 'terms' }">AGB</router-link>
					</li>

					<li>
						<router-link :to="{ name: 'delete-data' }">Datenlöschung</router-link>
					</li>
				</ul>
			</nav>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { RouterView, useRoute } from 'vue-router'

	const $route = useRoute()
	const isHome = computed(() => $route.name === 'home')
	const isDeepLink = computed(() => $route.meta.deepLink === true)
</script>

<style>
	@import url('/hubot-sans/stylesheet.css');
	@import url('/reset.css');

	:root {
		--primary-color: #1A237E;
		--page-background: #1B2480;
		/* 90% white + 10% primary; static fallback for browsers without color-mix() */
		--text-primary-color: #E8E9F2;
		--text-secondary-color: #A1A7E6;

		--size-text-main: 1rem;
		--size-text-large: 1.25rem;
		--size-text-larger: 1.5rem;
		--size-text-huge: 2rem;

		--container-border-radius: 12px;
		--container-border-color: oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.67) h);
	}

	@supports (color: color-mix(in srgb, white, black)) {
		:root {
			--text-primary-color: color-mix(in srgb, #ffffff 90%, var(--primary-color));
		}
	}

	html, body {
		min-height: 100%;
	}

	body {
		margin: 0;
		padding: 0;
		background: var(--page-background);
		color: var(--text-primary-color);

		font-family: 'Hubot Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-size: 12pt;
		font-weight: 500;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: 1.5;
		letter-spacing: 0.3px;
	}

	a {
		color: var(--text-primary-color);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s;

		&:hover {
			color: var(--text-secondary-color);
		}
	}

	strong {
		font-weight: 750 !important;
	}

	.crewlink-button,
	.crewlink-app-store-button a,
	.crewlink-google-play-button a,
	.skip-link {
		text-decoration: none;
	}

	:focus {
		outline: none;
	}

	:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 3px;
	}

	.skip-link {
		position: absolute;
		left: -9999px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
		z-index: 100;
		padding: 12px 20px;
		background: var(--page-background);
		color: var(--text-primary-color);
		font-weight: 800;
		border-radius: var(--container-border-radius);
	}

	.skip-link:focus-visible {
		position: fixed;
		left: 16px;
		top: 16px;
		width: auto;
		height: auto;
		overflow: visible;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	#main-content {
		flex: 1;
	}

	strong {
		font-weight: 800;
	}

	em {
		font-style: italic;
	}

	p.secondary, span.secondary {
		color: var(--text-secondary-color);
	}

	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	h1 {
		font-weight: 800;
		font-stretch: 125%;
		font-size: var(--size-text-huge);
		letter-spacing: 0px;
	}

	h2 {
		font-weight: 800;
		font-stretch: 125%;
		font-size: var(--size-text-larger);
		letter-spacing: 0px;
	}

	h3 {
		font-weight: 800;
		font-stretch: 125%;
		font-size: var(--size-text-large);
		letter-spacing: 0px;
	}

	h4 {
		font-weight: 800;
		font-stretch: 125%;
		font-size: var(--size-text-main);
	}

	@media screen and (max-width: 620px) {
		:root {
			--size-text-large: 1.1rem;
			--size-text-larger: 1.2rem;
			--size-text-huge: 1.4rem;
		}

		body {
			font-size: 10pt;
		}
	}

	.max-width {
		max-width: 1024px;
		margin: auto;
		position: relative;
	}

	.main-header {
		padding: 32px 20px;
		padding-bottom: 0px;

		&.bordered {
			border-bottom: 1px solid var(--container-border-color);
			padding-bottom: 32px;
		}

		.logo {

			a {
				text-decoration: none;
			}

			img {
				height: 64px;
			}
		}
	}

	.main-content {
		padding: 36px 20px;

		.text-content {
			background: oklch(from var(--page-background) calc(l * 0.86) calc(c * 1) h);
			padding: 24px;
			border-radius: var(--container-border-radius);

			h2 {
				font-size: var(--size-text-large);
			}

			p + p,
			p + address,
			p + ul,
			ul + h2,
			ul + p,
			address + p,
			h2 + p,
			h2 + address,
			h2 + ul,
			h2 + table {
				margin-top: 16px;
			}

			table {
				width: 100%;
				border-collapse: collapse;
			}

			th, td {
				padding: 10px;
				border: 1px solid oklch(from var(--page-background) calc(l * 1.3) calc(c * 1.3) h);
				text-align: left;
				vertical-align: top;
			}

			th {
				background: oklch(from var(--page-background) calc(l * 0.75) calc(c * 1) h);
			}

			ul {
				list-style-type: square;
				padding-left: 3ch;

				li {
					padding-left: 1ch;

					& + li {
						margin-top: 16px;
					}
				}
			}

			& + .text-content {
				margin-top: 24px;
			}
		}

		h1 + p {
			margin-top: 16px;
		}

		h1 + .document-date {
			margin-top: 8px;
		}

		h1 + .text-content,
		p + .text-content,
		.document-date + .text-content {
			margin-top: 24px;
		}

		hr {
			background: oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.67) h);
			height: 1px;
			border: 0px;
			margin: 16px 0px;
		}
	}

	.toolbar {
		border-bottom: 1px solid oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.67) h);
		padding: 0px 20px;

		.toolbar-content {
			padding: 16px 0px;
		}
	}

	.main-footer {

		.content {
			display: flex;
			flex-wrap: wrap;
			gap: 24px 16px;
			justify-content: center;
			align-items: center;
			padding-left: 20px;
			padding-right: 20px;
			padding-bottom: 32px;
			font-size: 0.8rem;
			color: var(--text-secondary-color);

			.links {
				display: flex;
				flex-wrap: wrap;
				gap: 16px;
				list-style: none;
				margin: 0;
				padding: 0;
			}
		}
	}
</style>
