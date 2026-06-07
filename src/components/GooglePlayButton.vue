<template>
    <div class="crewlink-google-play-button">
	    <a aria-label="Download bei Google Play, Android"
	       aria-describedby="google-play-requirements"
	       :href="STORE_ANDROID_URL"
	       rel="noopener noreferrer"
	       target="_blank">
		    <img src="/images/stores/get-on-google-play.svg" alt="" />
	    </a>

	    <span id="google-play-requirements" class="requirements">Android 9 oder neuer</span>
    </div>
</template>

<script setup lang="ts">
	import { STORE_ANDROID_URL } from '../config/links'
</script>

<style>
    .crewlink-google-play-button {
	    display: flex;
	    flex-direction: column;
	    align-items: center;

	    .requirements {
		    color: var(--text-secondary-color);
	    }

	    img {
		    border-radius: 8px;
		    transition: box-shadow 0.2s;
	    }

	    a:hover img {
		    box-shadow: 0px 4px 24px 8px oklch(from var(--page-background) calc(l * 1.5) calc(c * 1.5) h);
	    }
    }
</style>
