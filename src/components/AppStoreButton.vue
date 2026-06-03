<template>
    <div class="crewlink-app-store-button">
	    <a aria-label="Download im App Store, iPhone und iPad" href="">
		    <img src="/images/stores/get-on-app-store.svg" alt="App Store" />
	    </a>

	    <span class="requirements">iOS 17 oder neuer</span>
    </div>
</template>

<style>
    .crewlink-app-store-button {
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
