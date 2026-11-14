/*
 * Runs after `vite build`.
 *
 * The site is a single-page app, so a plain file host only knows about
 * /index.html. This writes a copy of that page for every other address, each
 * with its own title and description, so opening or refreshing a deep link
 * works without server configuration. It also writes 404.html, which most
 * static hosts serve for unknown addresses.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gamePath, games, site } from '../src/content/site.ts'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const shell = await readFile(join(dist, 'index.html'), 'utf8')

const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function page(title, description) {
  return shell
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      (_match, before, after) => `${before}${escapeHtml(description)}${after}`,
    )
}

const written = []

for (const game of games) {
  const address = gamePath(game)
  const file = join(dist, address, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(`${game.title} · ${site.name}`, game.summary))
  written.push(address)
}

await writeFile(join(dist, '404.html'), page(`Page not found · ${site.name}`, site.description))
written.push('/404.html')

console.log(`postbuild: wrote ${written.join(', ')}`)
