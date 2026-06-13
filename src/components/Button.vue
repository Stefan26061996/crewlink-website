<template>
	<button
		v-if="!href && !to"
		type="button"
		:class="buttonClass"
		v-bind="$attrs"
		@click="onClick"
	>
		<span v-if="$slots.icon" class="icon" aria-hidden="true">
			<slot name="icon" />
		</span>

		<span class="label">
			<slot />
		</span>
	</button>

	<a
		v-else-if="href"
		:href="href"
		:class="buttonClass"
		v-bind="$attrs"
		@click="onClick"
	>
		<span v-if="$slots.icon" class="icon" aria-hidden="true">
			<slot name="icon" />
		</span>

		<span class="label">
			<slot />
		</span>
	</a>

	<router-link
		v-else
		:to="to!"
		:class="buttonClass"
		@click="onClick"
	>
		<span v-if="$slots.icon" class="icon" aria-hidden="true">
			<slot name="icon" />
		</span>

		<span class="label">
			<slot />
		</span>
	</router-link>
</template>

<script setup lang="ts">
	import type { RouteLocationRaw } from 'vue-router'

	defineOptions({
		inheritAttrs: false,
	})

	const props = withDefaults(
		defineProps<{
			href?: string
			to?: RouteLocationRaw
			type?: string
			size?: string
		}>(),
		{
			type: 'borderless',
			size: 'regular'
		},
	)

	const emit = defineEmits<{
		click: [event: MouseEvent]
	}>()

	const buttonClass = ['crewlink-button', `type-${props.type}`, `size-${props.size}`]

	function onClick(event: MouseEvent) {
		emit('click', event)
	}
</script>

<style>
	.crewlink-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--text-primary-color);
		text-decoration: none;
		border: none;
		font: inherit;
		cursor: pointer;

		.icon {
			display: inline-block;

			svg {
				width: 24px;
				height: 24px;
				vertical-align: middle;
			}

			svg path {
				fill: currentColor;
			}
		}

		.label {
			display: inline-block;
		}

		&.type-borderless {
			/* leave as is */
		}

		&.type-primary {
			--text-color: oklch(from var(--text-primary-color) calc(l * 1.2) c h);
			--background-color: oklch(from var(--primary-color) calc(l * 1.5) calc(c * 1.4) h);
			--background-hover-color: oklch(from var(--background-color) calc(l * 1.25) calc(c * 1.4) h);

			background: var(--background-color);
			color: var(--text-color);

			padding: 8px 20px;
			border-radius: 256px;

			transition: background 0.2s, box-shadow 0.2s;

			&:hover {
				background: var(--background-hover-color);
				box-shadow: inset 0px 1px 0px oklch(from var(--background-hover-color) calc(l * 1.4) c h),
				            inset 0px -1px 0px oklch(from var(--background-hover-color) calc(l * 1.4) c h),
				            0px 2px 8px 4px oklch(from var(--background-hover-color) calc(l * 0.8) calc(c * 0.67) h);
			}
		}

		&.type-secondary {
			--color: var(--text-primary-color);
			--border-color: var(--color);

			border: 1px solid var(--border-color);
			color: var(--color);

			padding: 8px 20px;
			border-radius: 256px;

			transition: border 0.2s, color 0.2s, box-shadow 0.2s;

			&:hover {
				--color: #fff;
				box-shadow: inset 0px 0px 12px 4px oklch(from var(--color) l c h / 40%),
							0px 0px 8px 4px oklch(from var(--color) l c h / 40%);
			}
		}

		&.size-large {

			&.type-primary {
				padding: 16px 32px;
				font-size: var(--size-text-large);
			}
		}
	}
</style>
