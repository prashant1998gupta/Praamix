import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { HtmlTagDescriptor, Plugin } from 'vite'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
  /* The list of built files. scripts/postbuild.mjs reads it, then removes it. */
  build: { manifest: true },
})
