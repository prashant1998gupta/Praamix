/*
 * Runs after `vite build`.
 *
 * The site is a single-page app, so a plain file host only knows about
 * /index.html. This writes a real HTML file for every page listed in
 * src/content/routes.ts, each with its own title, description and link-preview
 * tags, so opening or refreshing any address works without server rules. It
 * also writes 404.html, which most static hosts serve for unknown addresses.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { images } from '../src/content/images.ts'
import { notFound, routes } from '../src/content/routes.ts'
import { channels, portfolios, site } from '../src/content/site.ts'
import { gamePath, sheriffTownVr } from '../src/content/game.ts'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const shell = await readFile(join(dist, 'index.html'), 'utf8')

/*
 * Each page's code is a separate file, fetched when the page is needed. For
 * the page a visitor lands on, that would mean waiting for the main code to
 * arrive before the page's own code is even asked for. So each page's HTML
 * names its code up front and the browser fetches both together.
 */
const built = JSON.parse(await readFile(join(dist, '.vite', 'manifest.json'), 'utf8'))
function codeFor(source) {
  const files = new Set()
  const visit = (key) => {
    const entry = built[key]
    if (!entry || entry.isEntry || files.has(entry.file)) return
    files.add(entry.file)
    for (const next of entry.imports ?? []) visit(next)
  }
  visit(source)
  return [...files]
}

/*
 * Structured data: labels search engines read, in the schema.org vocabulary.
 * They say the site's name is Praamix, that Praamix is a game studio with
 * this logo and these channels, and what Sheriff Town VR is. Only facts the
 * site already states; nothing about prices, dates or platforms.
 */
function structured(meta) {
  if (!site.url || meta === notFound || meta.noindex) return []
  const root = site.url.replace(/\/$/, '')
  const studio = {
    '@type': 'Organization',
    '@id': `${root}/#studio`,
    name: site.name,
    url: `${root}/`,
    logo: `${root}/icon-512.png`,
    description: site.description,
    sameAs: Object.values(channels).filter(Boolean),
  }
  const graph = []
  if (meta.path === '/') {
    graph.push(
      { '@type': 'WebSite', '@id': `${root}/#website`, name: site.name, url: `${root}/`, publisher: { '@id': `${root}/#studio` } },
      studio,
    )
  }
  if (meta.path === gamePath(sheriffTownVr)) {
    const art = images.posterArrest.file
    graph.push({
      '@type': 'VideoGame',
      name: sheriffTownVr.title,
      url: `${root}${meta.path}`,
      description: sheriffTownVr.summary,
      image: `${root}${art.base}-${art.fallback}.jpg`,
      genre: ['Sandbox', 'Virtual reality'],
      author: studio,
      publisher: { '@id': `${root}/#studio` },
      ...(sheriffTownVr.trailer ? { trailer: { '@type': 'VideoObject', name: sheriffTownVr.trailer.title, embedUrl: `https://www.youtube.com/embed/${sheriffTownVr.trailer.youtubeId}`, url: sheriffTownVr.trailer.url, thumbnailUrl: `${root}${art.base}-${art.fallback}.jpg` } } : {}),
    })
  }
  if (graph.length === 0) return []
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\u003c')
  return [`<script type="application/ld+json">${json}</script>`]
}

const esc = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function page(meta) {
  const tags = [
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
  ]

  /* Addresses are only written once the site has a real public address. */
  if (site.url && meta !== notFound) {
    const address = site.url.replace(/\/$/, '') + meta.path
    tags.push(`<link rel="canonical" href="${esc(address)}" />`)
    tags.push(`<meta property="og:url" content="${esc(address)}" />`)
  }

  /* The picture shown when a page is shared in a chat or on social media. */
  if (site.url) {
    const shared = images.posterArrest
    const { file } = shared
    const picture = `${site.url.replace(/\/$/, '')}${file.base}-${file.fallback}.jpg`
    tags.push(`<meta property="og:image" content="${esc(picture)}" />`)
    tags.push(`<meta property="og:image:alt" content="${esc(shared.alt)}" />`)
    tags.push('<meta name="twitter:card" content="summary_large_image" />')
  }

  if (meta.noindex) tags.push('<meta name="robots" content="noindex" />')
  tags.push(...structured(meta))

  if (meta.source) {
    for (const file of codeFor(meta.source)) tags.push(`<link rel="modulepreload" href="/${file}" />`)
  }

  /* Fetch the picture at the top of the page early, at the size this screen needs. */
  if (meta.preload) {
    const { file, sizes } = meta.preload
    const srcset = file.widths.map((width) => `${file.base}-${width}.avif ${width}w`).join(', ')
    tags.push(
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset}" imagesizes="${esc(sizes)}" fetchpriority="high" />`,
    )
  }

  /* The page is dark from the first byte, so nothing flashes white. A light page has the dark class taken off. */
  const themed = meta.night
    ? shell
    : shell
        .replace('<html lang="en" class="night">', '<html lang="en">')
        .replace('<meta name="theme-color" content="#0f1318" />', '<meta name="theme-color" content="#ffffff" />')

  return themed
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(meta.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      (_match, before, after) => `${before}${esc(meta.description)}${after}`,
    )
    .replace('</head>', () => `  ${tags.join('\n    ')}\n  </head>`)
}

const written = []

/*
 * Each page is written as <address>.html, for example services.html. Hosts
 * serve that file at /services with no trailing slash and no redirect, which
 * matches the address the site itself uses and the one given to search engines.
 */
for (const meta of routes) {
  const file = meta.path === '/' ? join(dist, 'index.html') : join(dist, `${meta.path}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(meta))
  written.push(meta.path)
}

await writeFile(join(dist, '404.html'), page(notFound))
written.push('/404.html')

/*
 * For search engines: the list of pages, and where to find it. Draft pages
 * are left out. The personal portfolio pages are listed too.
 */
if (site.url) {
  const origin = site.url.replace(/\/$/, '')
  const addresses = routes.filter((meta) => !meta.noindex).map((meta) => origin + meta.path)
  for (const folder of portfolios) {
    const files = (await readdir(join(dist, folder))).filter((name) => name.endsWith('.html')).sort()
    for (const name of files) {
      addresses.push(name === 'index.html' ? `${origin}/${folder}/` : `${origin}/${folder}/${name.replace(/\.html$/, '')}`)
    }
  }
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...addresses.map((address) => `  <url><loc>${esc(address)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')
  await writeFile(join(dist, 'sitemap.xml'), sitemap)
  await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
}

/* The list of built files has done its job. */
await rm(join(dist, '.vite'), { recursive: true, force: true })

/* Stamp the service worker with this build, so it replaces what the last build saved. */
const worker = join(dist, 'sw.js')
const stamp = Date.now().toString(36)
/* The core files it saves on a first visit: everything built, except the large 3D code. */
const core = (await readdir(join(dist, 'assets')))
  .filter((file) => !file.startsWith('showroom3d'))
  .map((file) => `/assets/${file}`)
await writeFile(
  worker,
  (await readFile(worker, 'utf8')).replace('__BUILD__', stamp).replace("['__CORE__']", JSON.stringify(core)),
)

console.log(`postbuild: wrote ${written.join(', ')}; service worker ${stamp}`)
