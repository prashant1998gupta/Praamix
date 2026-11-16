/*
 * The service worker: it keeps a copy of what a visitor has already opened,
 * so the next visit starts instantly and the site still works with no
 * connection. It only runs on the built site, never while developing.
 *
 * Three kinds of request, three ways of answering:
 *   pages          the network first, so a page is always fresh when online;
 *                  the saved copy if the network fails
 *   code and CSS   the saved copy first. These files have a unique name per
 *                  build, so a saved copy can never be out of date
 *   pictures, 3D   the saved copy at once, and a fresh one fetched quietly
 *   models, fonts  for next time
 *
 * The build stamps a new version below on every build. A new version throws
 * away the old copies.
 */
const VERSION = '__BUILD__'
/* The site's own code, styles and font. The build fills this in. The large 3D code is left out and saved only if used. */
const CORE = ['__CORE__']
const PAGES = `praamix-pages-${VERSION}`
const FILES = `praamix-files-${VERSION}`

self.addEventListener('install', (event) => {
  /*
   * Save the homepage and the site's core files during the first visit, so
   * every page works offline from then on, not only the ones already opened.
   */
  event.waitUntil(
    Promise.all([
      caches.open(PAGES).then((cache) => cache.add('/')),
      caches.open(FILES).then((cache) => cache.addAll(CORE.filter((file) => file.startsWith('/')))),
    ])
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== PAGES && name !== FILES).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

async function pageFirstFromNetwork(request) {
  const cache = await caches.open(PAGES)
  try {
    const fresh = await fetch(request)
    if (fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch {
    /* Offline: this page if it was opened before, otherwise the homepage, which can show any page. */
    return (
      (await cache.match(request, { ignoreSearch: true, ignoreVary: true })) ??
      (await cache.match('/', { ignoreVary: true })) ??
      Response.error()
    )
  }
}

/*
 * Saved copies are looked up by address alone. Servers often mark a file as
 * varying by request headers, and a script asks for a file with different
 * headers than the first-visit save did. Without ignoreVary the saved copy
 * would be passed over and the site would fail offline.
 */
const BY_ADDRESS = { ignoreVary: true }

async function savedFirst(request) {
  const cache = await caches.open(FILES)
  const saved = await cache.match(request, BY_ADDRESS)
  if (saved) return saved
  const fresh = await fetch(request)
  if (fresh.ok) cache.put(request, fresh.clone())
  return fresh
}

async function savedThenRefresh(request) {
  const cache = await caches.open(FILES)
  const saved = await cache.match(request, BY_ADDRESS)
  const refresh = fetch(request)
    .then((fresh) => {
      if (fresh.ok) cache.put(request, fresh.clone())
      return fresh
    })
    .catch(() => saved ?? Response.error())
  return saved ?? refresh
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  /* The personal portfolio pages are separate sites in their own folders. They go straight to the network. */
  if (/^\/(prashant|aman)(\/|$)/.test(url.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith(pageFirstFromNetwork(request))
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(savedFirst(request))
  } else if (/^\/(media|models)\//.test(url.pathname) || /\.(png|webp|avif|jpg|woff2|webmanifest)$/.test(url.pathname)) {
    event.respondWith(savedThenRefresh(request))
  }
})
