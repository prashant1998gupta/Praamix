import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Connect, HtmlTagDescriptor, Plugin } from 'vite'

/** The font file every page needs for its first paint. */
const CRITICAL_FONTS = ['manrope-latin-wght-normal']

/**
 * Asks the browser to fetch that font straight away instead of waiting for
 * the stylesheet, so text settles into its final shape sooner.
 */
function preloadFonts(): Plugin {
  return {
    name: 'praamix:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, context) {
        const files = Object.keys(context.bundle ?? {})
        const tags: HtmlTagDescriptor[] = []

        for (const name of CRITICAL_FONTS) {
          const file = files.find((entry) => entry.includes(name) && entry.endsWith('.woff2'))
          if (!file) continue
          tags.push({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `/${file}`,
              crossorigin: true,
            },
            injectTo: 'head',
          })
        }

        return tags
      },
    },
  }
}

/** The personal portfolio folders in public/. Keep in step with `portfolios` in src/content/site.ts. */
const PORTFOLIOS = ['prashant', 'aman']

/**
 * Makes the local servers treat the portfolio folders the way a host does:
 * /prashant goes to /prashant/, the folder shows its index page, and
 * /aman/cv shows cv.html. Without this the studio site would answer instead.
 */
function portfolioFolders(): Plugin {
  const serve: Connect.NextHandleFunction = (request, response, next) => {
    const [path, query = ''] = (request.url ?? '').split('?')
    const folder = PORTFOLIOS.find((name) => path === `/${name}` || path.startsWith(`/${name}/`))
    if (!folder) return next()

    if (path === `/${folder}`) {
      response.statusCode = 308
      response.setHeader('Location', `/${folder}/${query ? `?${query}` : ''}`)
      response.end()
      return
    }
    const last = path.slice(path.lastIndexOf('/') + 1)
    if (last === '') request.url = `${path}index.html${query ? `?${query}` : ''}`
    else if (!last.includes('.')) request.url = `${path}.html${query ? `?${query}` : ''}`
    next()
  }

  return {
    name: 'praamix:portfolio-folders',
    configureServer(server) {
      server.middlewares.use(serve)
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts(), portfolioFolders()],
  /* The list of built files. scripts/postbuild.mjs reads it, then removes it. */
  build: { manifest: true },
})
