(() => {
  const path = window.location.pathname || '/';

  const parseDeepLinkPath = (pathname) => {
    const profile = pathname.match(/^\/@([^/]+)$/);
    if (profile) return { type: 'profile', id: profile[1] };

    const event = pathname.match(/^\/events\/([^/]+)$/);
    if (event) return { type: 'event', id: event[1] };

    const listing = pathname.match(/^\/listings\/([^/]+)$/);
    if (listing) return { type: 'listing', id: listing[1] };

    return { type: 'unknown', id: '' };
  };

  const { type, id } = parseDeepLinkPath(path);
  const root = document.documentElement;

  root.dataset.linkType = type;
  root.dataset.linkId = id;
  root.dataset.canonicalUrl = `https://crewlink.cloud${path}`;

  const openLink = document.getElementById('open-same-url');
  
  if (openLink) {
    openLink.href = window.location.href;
  }
})();
