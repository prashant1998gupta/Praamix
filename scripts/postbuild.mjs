/*
 * Runs after `vite build`.
 *
 * The site is a single-page app, so a plain file host only knows about
 * /index.html. This writes a real HTML file for every page listed in
 * src/content/routes.ts, each with its own title, description and link-preview
 * tags, so opening or refreshing any address works without server rules. It
 * also writes 404.html, which most static hosts serve for unknown addresses.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { notFound, routes } from '../src/content/routes.ts'
import { site } from '../src/content/site.ts'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const shell = await readFile(join(dist, 'index.html'), 'utf8')

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

  /* Fetch the picture at the top of the page early, at the size this screen needs. */
  if (meta.preload) {
    const { file, sizes } = meta.preload
    const srcset = file.widths.map((width) => `${file.base}-${width}.avif ${width}w`).join(', ')
    tags.push(
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset}" imagesizes="${esc(sizes)}" fetchpriority="high" />`,
    )
  }

  return shell
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

console.log(`postbuild: wrote ${written.join(', ')}`)
