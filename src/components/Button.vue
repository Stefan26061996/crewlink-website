<template>
    <router-link :to="props.to" :class="['crewlink-button', 'type-' + type]">
		<span v-if="$slots.icon" class="icon">
			<slot name="icon"></slot>
		</span>

	    <span class="label">
		    <slot></slot>
	    </span>
    </router-link>
</template>

<script setup lang="ts">
	import { RouterLink } from 'vue-router'

	defineOptions({
		inheritAttrs: false
	})

	const props = defineProps({
		// @ts-ignore
		...RouterLink.props,

		type: {
			type: String,
			required: false,
			default: 'borderless'
		}
	})
</script>

<style>
    .crewlink-button {
	    display: inline-flex;
	    align-items: center;
	    gap: 8px;
	    color: var(--text-primary-color);
	    text-decoration: none;

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
    }
</style>
