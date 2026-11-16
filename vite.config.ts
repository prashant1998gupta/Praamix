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
/*
 * On the live site, Cloudflare runs worker/ to email a project brief. On this
 * machine there is no Cloudflare, so `npm run dev` and `npm run preview` run
 * the same code here, with the email printed in the terminal instead of sent.
 */
function localBrief(): Plugin {
  const answer: Connect.NextHandleFunction = (req, res) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', async () => {
      const { handleBrief } = await import('./worker/brief.js')
      const headers = new Headers()
      for (const [name, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(name, value)
      const method = req.method ?? 'GET'
      const request = new Request(`http://${req.headers.host}/api/brief`, {
        method,
        headers,
        body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
      })
      const response = await handleBrief(request, {
        EMAIL: {
          send: async (message) => {
            console.log(`\n[brief] This is the local site, so nothing was emailed. It would have gone to the studio as:\n\n${message.subject}\n\n${message.text}`)
          },
        },
        BRIEF_TO: 'local@example.invalid',
        BRIEF_FROM: 'website@praamix.com',
      })
      res.statusCode = response.status
      res.setHeader('Content-Type', response.headers.get('Content-Type') ?? 'application/json')
      res.end(await response.text())
    })
  }
  return {
    name: 'praamix:local-brief',
    configureServer(server) {
      server.middlewares.use('/api/brief', answer)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/brief', answer)
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadFonts(), portfolioFolders(), localBrief()],
  /* The list of built files. scripts/postbuild.mjs reads it, then removes it. */
  build: { manifest: true },
})
