// Tidies the address bar on the live site: aidennguyen.ca/about.html shows as aidennguyen.ca/about,
// and index.html shows as just aidennguyen.ca/
// The links still point at the .html files so the site works when previewed locally;
// GitHub Pages serves /about as about.html, so refreshing the tidied address still works
if (location.hostname.endsWith('aidennguyen.ca')) {
    const cleanPath = location.pathname
        .replace(/index\.html$/, '')
        .replace(/\.html$/, '');

    if (cleanPath !== location.pathname) {
        history.replaceState(null, '', cleanPath + location.search + location.hash);
    }
}
