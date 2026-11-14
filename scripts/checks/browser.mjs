import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

export const root = fileURLToPath(new URL('../../', import.meta.url))

const CHANNELS = [
  ['chrome', 'Google Chrome'],
  ['msedge', 'Microsoft Edge'],
]

/** Starts a browser that is already installed on this machine. Nothing is downloaded. */
export async function launchBrowser(args = []) {
  const failures = []

  for (const [channel, label] of CHANNELS) {
    try {
      const browser = await chromium.launch({ channel, args })
      return { browser, name: `${label} ${browser.version()}, headless, on ${process.platform}` }
    } catch (error) {
      failures.push(`${label}: ${String(error.message).split('\n')[0]}`)
    }
  }

  throw new Error(`Could not start an installed browser.\n${failures.join('\n')}`)
}

/** Serves a built folder the way `npm run preview` does. */
export async function serve(outDir, port) {
  const server = await preview({
    root,
    logLevel: 'silent',
    build: { outDir },
    preview: { host: '127.0.0.1', port, strictPort: false },
  })
  const address = server.httpServer.address()

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((done) => {
        server.httpServer.closeAllConnections?.()
        server.httpServer.close(() => done())
      }),
  }
}
