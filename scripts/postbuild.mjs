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
import { notFound, routes } from '../src/content/routes.ts'
import { site } from '../src/content/site.ts'

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

  if (meta.noindex) tags.push('<meta name="robots" content="noindex" />')

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

  /* Dark pages carry the dark class and browser colour from the first byte, so nothing flashes white. */
  const themed = meta.night
    ? shell
        .replace('<html', '<html class="night"')
        .replace('<meta name="theme-color" content="#ffffff" />', '<meta name="theme-color" content="#0f1318" />')
    : shell

  return themed
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(meta.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      (_match, before, after) => `${before}${esc(meta.description)}${after}`,
    )
    .replace('</head>', () => `  ${tags.join('\n    ')}\n  </head>`)
}

const written = []

for (const meta of routes) {
  const file = meta.path === '/' ? join(dist, 'index.html') : join(dist, meta.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(meta))
  written.push(meta.path)
}

await writeFile(join(dist, '404.html'), page(notFound))
written.push('/404.html')

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
