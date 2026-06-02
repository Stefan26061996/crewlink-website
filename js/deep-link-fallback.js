(() => {
  const ANDROID_PACKAGE = 'com.crewlink.eventify';
  const path = window.location.pathname || '/';
  const httpsUrl = window.location.href;

  const parseDeepLinkPath = (pathname) => {
    const profile = pathname.match(/^\/@([^/]+)$/);
    if (profile) return { type: 'profile', id: profile[1] };

    const event = pathname.match(/^\/events\/([^/]+)$/);
    if (event) return { type: 'event', id: event[1] };

    const listing = pathname.match(/^\/listings\/([^/]+)$/);
    if (listing) return { type: 'listing', id: listing[1] };

    return { type: 'unknown', id: '' };
  };

  const isAndroid = /android/i.test(navigator.userAgent);

  /** Chrome fallback when App Links are not verified yet. */
  const buildAndroidIntentUrl = () => {
    const hostPath = `${window.location.host}${path}`;
    const fallback = encodeURIComponent(httpsUrl);
    return `intent://${hostPath}#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
  };

  const { type, id } = parseDeepLinkPath(path);
  const root = document.documentElement;

  root.dataset.linkType = type;
  root.dataset.linkId = id;
  root.dataset.canonicalUrl = `https://crewlink.cloud${path}`;

  const openLink = document.getElementById('open-same-url');
  if (!openLink) return;

  const openTarget = isAndroid ? buildAndroidIntentUrl() : httpsUrl;
  openLink.href = openTarget;

  openLink.addEventListener('click', (event) => {
    if (!isAndroid) return;
    event.preventDefault();
    window.location.assign(buildAndroidIntentUrl());
  });
})();
