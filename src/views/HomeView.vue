<template>
	<header class="home-main">
		<div class="max-width">
			<div class="logo">
				<router-link :to="{ name: 'home' }">
					<img src="/images/logo-white.svg" alt="Crewlink" />
				</router-link>
			</div>

			<div class="content">
				<h1>
					Finde Helfer für dein nächstes Event.
				</h1>

				<p>
					Oder finde Events, bei denen du aushelfen kannst.
				</p>

				<ul class="stores">
					<li>
						<GooglePlayButton />
					</li>

					<li>
						<AppStoreButton />
					</li>
				</ul>
			</div>

			<div class="hero">
				<img src="/images/screenshots/main-with-hand.webp"
				     alt="Crewlink-App auf dem Smartphone: Event-Feed mit Veranstaltungen und Helfer-Angeboten" />
			</div>
		</div>
	</header>

	<section class="content-section main-pitch">
		<div class="max-width">
			<h2>Du veranstaltest ein Event, aber dir fehlen</h2>

			<p class="roles">
				<Typewriter :words="pitchRoles" />
			</p>

			<p>
				Oder du möchtest dabei helfen, Events erfolgreich durchzuführen?
			</p>

			<p>
				Crewlink verbindet dich mit genau den Leuten, die du brauchst.
			</p>
		</div>
	</section>

	<section class="content-section heading-section">
		<div class="max-width">
			<h2>Für Eventveranstalter/innen:</h2>
		</div>
	</section>

	<section class="content-section feature-section leading">
		<div class="max-width feature">
			<div class="image">
				<img
					:src="searchHelpersMockup.src"
					:width="searchHelpersMockup.width"
					:height="searchHelpersMockup.height"
					alt=""
					aria-hidden="true"
				/>
			</div>

			<div class="description">
				<h3>Suche Helfer/innen für dein Event</h3>
				<p>
					Gib an, welches Equipment oder Personal du noch benötigst und finde passende Helfer.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section feature-section trailing">
		<div class="max-width feature">
			<div class="image">
				<img
					:src="trustScoreMockup.src"
					:width="trustScoreMockup.width"
					:height="trustScoreMockup.height"
					alt=""
					aria-hidden="true"
				/>
			</div>

			<div class="description">
				<h3>Prüfe die Zuverlässigkeit von Helfern</h3>
				<p>
					Unser Vertrauensscore gibt dir einen Indikator, wie zuverlässig und vertrauenswürdig ein Helfer ist.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section other-features-section">
		<ul class="max-width features">
			<li class="feature">
				<div class="icon" aria-hidden="true"><ChatIcon /></div>
				<h4>Chats mit Helfern</h4>
				<p>Direktnachrichten mit Helfern sind natürlich inklusive</p>
			</li>

			<li class="feature">
				<div class="icon" aria-hidden="true"><NotificationIcon /></div>
				<h4>Benachrichtigungen zu Helfern</h4>
				<p>Du erfährst sofort, wenn sich Helfer melden</p>
			</li>

			<li class="feature">
				<div class="icon" aria-hidden="true"><ProfileIcon /></div>
				<h4>Profil für Veranstalter</h4>
				<p>Teile der Community mit, welche Art von Events zu veranstaltest</p>
			</li>
		</ul>
	</section>

	<section class="content-section heading-section">
		<div class="max-width">
			<h2>Für Helfer/innen:</h2>
		</div>
	</section>

	<section class="content-section feature-section leading">
		<div class="max-width feature">
			<div class="image">
				<img
					:src="findEventsMockup.src"
					:width="findEventsMockup.width"
					:height="findEventsMockup.height"
					alt=""
					aria-hidden="true"
				/>
			</div>

			<div class="description">
				<h3>Finde Events, die deine Hilfe brauchen</h3>
				<p>
					Lass dein Equipment nicht ungenutzt – biete es anderen gegen Miete an. Reduzierte Downtime, glückliche Menschen. Und mehr Events, die doch noch stattfinden können.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section feature-section trailing">
		<div class="max-width feature">
			<div class="image">
				<img
					:src="planHelpMockup.src"
					:width="planHelpMockup.width"
					:height="planHelpMockup.height"
					alt=""
					aria-hidden="true"
				/>
			</div>

			<div class="description">
				<h3>Plane deine Hilfe</h3>
				<p>
					Lege genau fest, welches Equipment und welches Personal für Events zur Verfügung steht. Du kannst dein Equipment auch in Paketen anbieten, z.B. in Kombination
					mit Personal.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section other-features-section">
		<ul class="max-width features">
			<li class="feature">
				<div class="icon" aria-hidden="true"><ChatIcon /></div>
				<h4>Chats mit Veranstaltern</h4>
				<p>Direktnachrichten mit Veranstaltern sind natürlich inklusive</p>
			</li>

			<li class="feature">
				<div class="icon" aria-hidden="true"><NotificationIcon /></div>
				<h4>Benachrichtigungen zu Veranstaltern</h4>
				<p>Du erfährst sofort, wenn sich Veranstalter melden</p>
			</li>

			<li class="feature">
				<div class="icon" aria-hidden="true"><ProfileIcon /></div>
				<h4>Profil für Helfer</h4>
				<p>Teile der Community mit, was du anzubieten hast</p>
			</li>
		</ul>
	</section>

	<section class="content-section special-feature-section" aria-hidden="true">
		<div class="max-width content">
			<img class="feature-1"
			     :src="feedFiltersMockup.src"
			     :width="feedFiltersMockup.width"
			     :height="feedFiltersMockup.height"
			     alt="" />

			<img class="feature-2"
			     :src="chatsMockup.src"
			     :width="chatsMockup.width"
			     :height="chatsMockup.height"
			     alt="" />
		</div>
	</section>

	<section class="content-section heading-section" aria-hidden="true">
		<div class="max-width">
			<h2>Häufig gestellte Fragen</h2>
		</div>
	</section>

	<section class="content-section faq-section" aria-label="Häufig gestellte Fragen">
		<div class="max-width">
			<dl>
				<dt>Für wen ist Crewlink?</dt>
				<dd>Crewlink ist für Veranstalter und Helfer gleichermaßen. Veranstalter posten ihre Events und Helfer suchen sich diese raus. Helfer können zudem auch proaktiv ihr Equipment zur Miete inserieren.</dd>

				<dt>Wie viel kostet Crewlink?</dt>
				<dd>Die Basisnutzung ist komplett kostenlos. Um mehr als ein Event und Inserat erstellen zu können, benötigst du jedoch Crewlink Pro oder Business. Die Preise entnimmst du aus den jeweiligen Stores.</dd>

				<dt>Warum muss ich mich anmelden?</dt>
				<dd>Zur Betrugs- und Spamprävention ist es erforderlich, dass du dich anmeldest, um an Events teilzunehmen oder Inhalte zu erstellen. Du kannst als Gast jedoch frei erkunden.<br />Um dich anzumelden stehen E-Mail, Apple, Google und Facebook zur Verfügung.</dd>

				<dt>Ich habe ein Problem, an wen kann ich mich wenden?</dt>
				<dd>Schildere dein Problem, idealerweise mit verwendetem Gerät, an <a href="mailto:hallo@crewlink.cloud">hallo@crewlink.cloud</a>.</dd>
			</dl>
		</div>
	</section>

	<section class="content-section download-section">
		<h2>Jetzt herunterladen und anmelden!</h2>

		<ul class="platforms">
			<li>
				<GooglePlayButton />
			</li>

			<li>
				<AppStoreButton />
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
	import GooglePlayButton from '../components/GooglePlayButton.vue'
	import AppStoreButton from '../components/AppStoreButton.vue'
	import Typewriter from '../components/Typewriter.vue'
	import ChatIcon from '../assets/icons/chat.svg'
	import NotificationIcon from '../assets/icons/notification.svg'
	import ProfileIcon from '../assets/icons/profile.svg'
	import searchHelpersMockup from '@/assets/screenshots/organizer-collaborations-ios-de.png?mockup=iphone17pro&preset=feature-leading&format=webp&w=600'
	import trustScoreMockup from '@/assets/screenshots/trust-score-ios-de.png?mockup=iphone17pro&preset=feature-trailing&format=webp&w=600'
	import findEventsMockup from '@/assets/screenshots/feed-android-de.png?mockup=pixel8pro&preset=feature-leading&format=webp&w=600'
	import planHelpMockup from '@/assets/screenshots/collaboration-equipment-android-de.png?mockup=pixel8pro&preset=feature-trailing&format=webp&w=600'
	import feedFiltersMockup from '@/assets/screenshots/feed-filters-ios-de.png?mockup=iphone17pro&preset=special-feature-left&format=webp&w=600'
	import chatsMockup from '@/assets/screenshots/chats-ios-de.png?mockup=iphone17pro&preset=special-feature-right&format=webp&w=600'

	const pitchRoles = [
		'Tontechniker',
		'DJs',
		'Light Jockeys',
		'Fotografen',
		'Barkeeper',
		'Baristas',
		'Zauberkünstler',
		'Lautsprecher',
		'Mikrofonständer',
		'Kabel',
		'Bühnenvorhänge',
		'mobile Duschen',
		'Feuerlöscher',
	]
</script>

<style>
	header.home-main {
		overflow: hidden;

		.logo a {
			text-decoration: none;
		}

		background: url("/images/header.webp");
		background-position: center;
		background-size: cover;
		padding-top: 48px;

		.logo {

			img {
				height: 96px;
				margin-left: -42px;
				transition: height 0.2s, margin 0.2s;
			}
		}

		.content {
			box-sizing: border-box;
			padding-top: 64px;
			padding-bottom: calc(384px - 192px);
			padding-left: 16px;
			padding-right: 16px;
			max-width: calc(100% - 312px);
			transition: max-width 0.2s, padding 0.2s;

			h1, p {
				font-size: clamp(1rem, 4vw, 2rem);
			}

			.stores {
				display: flex;
				gap: 16px;
				margin-top: 24px;

				transition: margin 0.2s, gap 0.2s;
			}
		}

		.hero {
			position: absolute;
			bottom: 0;
			right: 0;
			margin-bottom: -6px;
			text-align: right;

			transition: right 0.2s, bottom 0.2s;

			img {
				width: 100%;
				transition: width 0.2s;
			}
		}

		/* 1024px (max-width) + 42px logo offset + 8px gap */
		@media screen and (max-width: 1074px) {

			.logo {
				padding-left: 20px;

				img {
					margin-left: 0px;
				}
			}
		}

		@media screen and (max-width: 860px) {

			.logo {

				img {
					height: 64px;
				}
			}

			.content {
				max-width: calc(100% - 148px);
				padding-top: 48px;

				.stores {
					flex-direction: column;
					align-items: flex-start;
					gap: 24px;
					margin-top: 32px;
					margin-bottom: -128px;
				}
			}

			.hero {
				right: 24px;

				img {
					width: 67%;
				}
			}
		}

		@media screen and (max-width: 520px) {
			.logo {
				text-align: center;
			}

			.content {
				max-width: 100%;

				h1, p {
					text-align: center;
				}

				.stores {
					margin-top: 84px;
					margin-bottom: -128px;
				}
			}

			.hero {
				bottom: -84px;
			}
		}
	}

	.content-section {
		box-sizing: border-box;
		padding: 32px 24px;
	}

	.main-pitch {
		background: oklch(from var(--page-background) calc(l * 0.9) c h);
		padding-top: 48px;
		padding-bottom: 48px;
		text-align: center;

		h2 {
			color: var(--text-secondary-color);
			font-size: var(--size-text-large);
			font-weight: 500;
			font-stretch: 100%;
		}

		p {
			color: var(--text-secondary-color);
			font-size: var(--size-text-large);
		}

		.roles {
			font-size: clamp(1.0rem, 5vw, 2.0rem);
			font-stretch: 125%;
			font-weight: 800;
			color: var(--text-primary-color);

			margin: 16px 0px;
			padding: 8px 28px;
			background: oklch(from var(--page-background) calc(l * 0.7) calc(c * 0.7) h);

			display: inline-block;
			border-radius: 160px;

			.cursor {
				margin-top: -4px;
			}
		}
	}

	.heading-section {
		border-top: 1px solid oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.35) h);
	}

	.feature-section {
		--gradient-stop-color: oklch(from var(--page-background) calc(l * 1.2) calc(c * 1.35) h);
		background: linear-gradient(to bottom, transparent 50%, var(--gradient-stop-color));
		border-top: 1px solid oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.67) h);

		.feature {
			display: flex;
			align-items: center;
			gap: 36px;

			.image {
				width: 25%;
				flex-shrink: 0;
				transition: margin 0.2s;

				img {
					display: block;
					width: 100%;
					height: auto;
					object-fit: contain;
				}
			}

			.description {
				transition: margin 0.2s;

				h3 {
					font-size: var(--size-text-larger);
				}

				p {
					font-size: var(--size-text-large);
					color: var(--text-secondary-color);
					margin-top: 16px;
				}
			}
		}

		&:not(:has(+ .feature-section)) {
			border-bottom: 1px solid oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.67) h);
		}

		&:has(+ .feature-section) {

			.image {
				margin-bottom: -10%;
			}

			.description {
				margin-top: 64px;
			}
		}

		& + .feature-section {

			.image {
				margin-top: -10%;
				margin-bottom: -10%;
			}
		}

		@media screen and (max-width: 620px) {

			.image {
				margin: 0 !important;
			}

			.description {
				margin: 0 !important;
			}
		}

		&.leading {

			.feature {

				.image {
					order: 1;
				}

				.description {
					order: 2;
				}
			}
		}

		&.trailing {

			.feature {

				.image {
					order: 2;
				}

				.description {
					order: 1;
				}
			}
		}
	}

	.heading-section + .feature-section {
		border-top: 0px;
	}

	.other-features-section {
		padding-top: 96px;
		padding-bottom: 96px;
		background: oklch(from var(--page-background) calc(l * 0.9) c h);

		.features {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 64px 32px;

			.feature {
				flex: 1 1 280px;
				max-width: 320px;
				min-width: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;

				.icon {
					width: 64px;
					height: 64px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: oklch(from var(--page-background) calc(l * 0.7) calc(c * 0.7) h);
					border-radius: 16px;
					margin-bottom: 16px;
					color: var(--text-primary-color);

					svg {
						fill: currentColor;
						width: 32px;
						height: 32px;
					}
				}

				p {
					color: var(--text-secondary-color);
				}
			}
		}
	}

	.faq-section {

		h2 + dl {
			margin-top: 16px;
		}

		dl {

			dt {
				font-weight: 600;
				font-size: var(--size-text-large);
			}

			dd {
				color: var(--text-secondary-color);
			}

			dd + dt {
				margin-top: 24px;
			}

			dt + dd {
				margin-top: 8px;
			}
		}
	}

	.special-feature-section {
		border-top: 1px solid oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.35) h);
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;

		padding-top: 64px;
		padding-bottom: 64px;

		background: radial-gradient(circle at center, oklch(from var(--page-background) calc(l * 1.7) calc(c * 2) h), transparent 50%);

		.content {
			object-fit: contain;
		}

		.feature-1,
		.feature-2 {
			max-height: 768px;
			max-width: calc(50svw - 24px);
			height: auto;
			width: auto;
		}

		.feature-1 {
			filter: drop-shadow(16px 8px 24px rgba(0 0 0 / 42%));
		}

		.feature-2 {
			margin-left: -38px;
			margin-bottom: 96px;
			filter: drop-shadow(-16px 8px 24px rgba(0 0 0 / 56%));
		}
	}

	.download-section {
		padding-top: 128px;
		padding-bottom: 128px;

		h2 {
			text-align: center;
		}

		.platforms {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 16px;
			margin-top: 24px;
		}
	}
</style>
