<script setup lang="ts">
	import { onMounted } from 'vue'
	import { useRoute } from 'vue-router'

	/**
	 * GitHub Pages hat kein /invite/** Rewrite wie Firebase Hosting.
	 * SPA landet hier via 404.html → Weiterleitung auf statisches invite.html.
	 */
	const route = useRoute()

	onMounted(() => {
		const raw = route.params.code
		const code = typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? String(raw[0] || '').trim() : ''
		const target = code
			? `/invite.html?code=${encodeURIComponent(code)}`
			: '/invite.html'
		window.location.replace(target)
	})
</script>

<template>
	<div class="main-content max-width invite-redirect">
		<p class="secondary">Einladung wird geladen…</p>
	</div>
</template>

<style scoped>
	.invite-redirect {
		text-align: center;
		padding-top: 48px;
	}
</style>
