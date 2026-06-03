<script setup lang="ts">
	import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

	type Phase = 'typing' | 'paused' | 'deleting' | 'waiting'

	const props = withDefaults(
		defineProps<{
			words: string[]
			typeDelayMs?: number
			deleteDelayMs?: number
			pauseAfterTypeMs?: number
			pauseBeforeTypeMs?: number
		}>(),
		{
			typeDelayMs: 90,
			deleteDelayMs: 45,
			pauseAfterTypeMs: 1800,
			pauseBeforeTypeMs: 200,
		},
	)

	const displayedText = ref('')
	const wordIndex = ref(0)
	const phase = ref<Phase>('typing')

	const cursorBlink = computed(() => phase.value === 'paused')

	let timeoutId: ReturnType<typeof setTimeout> | undefined
	let reducedMotionIntervalId: ReturnType<typeof setInterval> | undefined

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

	function filteredWords(): string[] {
		return props.words.filter((word) => word.length > 0)
	}

	function currentWord(): string {
		const words = filteredWords()
		return words[wordIndex.value] ?? ''
	}

	function clearScheduled() {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId)
			timeoutId = undefined
		}
	}

	function clearReducedMotionInterval() {
		if (reducedMotionIntervalId !== undefined) {
			clearInterval(reducedMotionIntervalId)
			reducedMotionIntervalId = undefined
		}
	}

	function schedule(delayMs: number, callback: () => void) {
		clearScheduled()
		timeoutId = setTimeout(callback, delayMs)
	}

	function advanceWordIndex() {
		const words = filteredWords()
		if (words.length === 0) {
			return
		}

		wordIndex.value = (wordIndex.value + 1) % words.length
	}

	function tick() {
		const word = currentWord()

		if (phase.value === 'typing') {
			const nextLength = displayedText.value.length + 1
			displayedText.value = word.slice(0, nextLength)

			if (displayedText.value.length < word.length) {
				schedule(props.typeDelayMs, tick)
				return
			}

			phase.value = 'paused'
			schedule(props.pauseAfterTypeMs, tick)
			return
		}

		if (phase.value === 'paused') {
			phase.value = 'deleting'
			tick()
			return
		}

		if (displayedText.value.length > 0) {
			displayedText.value = displayedText.value.slice(0, -1)
			schedule(props.deleteDelayMs, tick)
			return
		}

		advanceWordIndex()
		phase.value = 'waiting'
		schedule(props.pauseBeforeTypeMs, () => {
			phase.value = 'typing'
			tick()
		})
	}

	function startTypewriter() {
		const words = filteredWords()
		if (words.length === 0) {
			displayedText.value = ''
			return
		}

		wordIndex.value = 0
		phase.value = 'typing'
		displayedText.value = ''
		clearScheduled()
		tick()
	}

	function startReducedMotion() {
		const words = filteredWords()
		if (words.length === 0) {
			displayedText.value = ''
			return
		}

		wordIndex.value = 0
		displayedText.value = words[0]
		clearReducedMotionInterval()

		reducedMotionIntervalId = setInterval(() => {
			const list = filteredWords()
			if (list.length === 0) {
				displayedText.value = ''
				return
			}

			wordIndex.value = (wordIndex.value + 1) % list.length
			displayedText.value = list[wordIndex.value]
		}, 4000)
	}

	function stop() {
		clearScheduled()
		clearReducedMotionInterval()
	}

	function start() {
		stop()

		if (prefersReducedMotion.matches) {
			startReducedMotion()
		} else {
			startTypewriter()
		}
	}

	onMounted(() => {
		start()
	})

	onUnmounted(() => {
		stop()
	})

	watch(
		() => props.words,
		() => {
			start()
		},
		{ deep: true },
	)
</script>

<template>
	<span class="typewriter" aria-live="polite">
		{{ displayedText }}<span class="cursor" :class="{ 'cursor--blink': cursorBlink }" aria-hidden="true"></span>
	</span>
</template>

<style>
	.typewriter .cursor {
		display: inline-block;
		width: 3px;
		height: 2.4rem;
		transition: opacity 100ms ease;
		background: oklch(from var(--primary-color) calc(l * 2.3) calc(c * 2.0) h);
		vertical-align: middle;
	}

	.typewriter .cursor--blink {
		animation: typewriter-cursor-blink 1s linear infinite;
	}

	@keyframes typewriter-cursor-blink {
		0% {
			opacity: 1;
		}

		5% {
			opacity: 0;
		}

		45% {
			opacity: 0;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 1;
		}
	}
</style>
