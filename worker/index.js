/*
 * The one piece of server code the site has. Cloudflare serves every page and
 * file by itself; only addresses under /api/ come here (see wrangler.jsonc).
 *
 *   /api/brief   the contact form's project brief, emailed to the studio
 *
 * Anything else under /api/ gets the site's ordinary "not found" page.
 */
import { handleBrief } from './brief.js'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/brief') return handleBrief(request, env)
    return env.ASSETS.fetch(request)
  },
}
