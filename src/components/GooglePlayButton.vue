<template>
    <div class="crewlink-google-play-button">
	    <a aria-label="Download bei Google Play, Android" href="">
		    <img src="/images/stores/get-on-google-play.svg" alt="Google Play" />
	    </a>

	    <span class="requirements">Android 9 oder neuer</span>
    </div>
</template>

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
