/*
 * Receives a project brief from the contact form and emails it to the studio.
 *
 * It is careful about what it accepts, because anyone can post to it:
 *   - only a POST of JSON, from this site's own pages, of a sensible size
 *   - every answer is checked again here, whatever the form already checked
 *   - nothing a visitor types can alter who the email goes to
 *   - a robot that fills in the hidden field, or answers faster than a person
 *     could, is told "sent" and nothing is sent
 *
 * The email goes through Cloudflare, from an address on the site's own domain
 * to the studio's inbox. The inbox address is a secret kept in Cloudflare
 * (BRIEF_TO), never in this repository. Replying to the email replies to the
 * visitor.
 */

const MAX_BYTES = 20_000
/* A person takes longer than this to fill in three fields. */
const MIN_MILLISECONDS = 2500
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/

/* What each answer is called in the email, and how long it may be. */
const FIELDS = [
  ['name', 'Name', 120],
  ['email', 'Email', 200],
  ['company', 'Company or studio', 200],
  ['summary', 'About the game', 5000],
  ['gameType', 'Game type', 200],
  ['platforms', 'Target platforms', 300],
  ['engine', 'Preferred engine', 200],
  ['budget', 'Budget range', 200],
  ['timeframe', 'Timeframe', 200],
]

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

/* One line of text: no line breaks, which is what keeps a visitor's words out of the email's headers. */
// eslint-disable-next-line no-control-regex -- control characters are exactly what is being removed
const oneLine = (value) => String(value ?? '').replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').trim()
/* Several lines of text, with stray control characters removed. */
// eslint-disable-next-line no-control-regex -- as above
const manyLines = (value) => String(value ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim()

/**
 * Reads and checks a brief. Returns { brief } when it is acceptable,
 * { robot: true } when it should be quietly dropped, or { error } with the
 * reason it was refused.
 */
export function readBrief(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'not-a-brief' }

  /* The hidden field is invisible to people, so only a robot fills it in. */
  if (oneLine(input.website) !== '') return { robot: true }
  const elapsed = Number(input.elapsed)
  if (Number.isFinite(elapsed) && elapsed < MIN_MILLISECONDS) return { robot: true }

  const brief = {}
  for (const [key, , limit] of FIELDS) {
    const raw = Array.isArray(input[key]) ? input[key].join(', ') : input[key]
    const value = key === 'summary' ? manyLines(raw) : oneLine(raw)
    if (value.length > limit) return { error: `${key}-too-long` }
    brief[key] = value
  }

  if (!brief.name) return { error: 'name-missing' }
  if (!EMAIL.test(brief.email)) return { error: 'email-invalid' }
  if (brief.summary.length < 10) return { error: 'summary-too-short' }
  return { brief }
}

/** The email, as Cloudflare's send() wants it. */
export function asEmail(brief, { to, from }) {
  const lines = FIELDS.filter(([key]) => brief[key] !== '').map(([key, label]) => (key === 'summary' ? `${label}:\n${brief[key]}\n` : `${label}: ${brief[key]}`))
  return {
    to,
    from: { email: from, name: 'Praamix website' },
    replyTo: { email: brief.email, name: brief.name },
    subject: `Project brief from ${brief.name}`,
    text: `${lines.join('\n')}\n\n--\nSent from the project brief form on praamix.com. Reply to this email to answer ${brief.name}.\n`,
  }
}

/* True when the request says it comes from a page of this same site. */
function sameSite(request) {
  try {
    return new URL(request.headers.get('Origin') ?? '').host === new URL(request.url).host
  } catch {
    return false
  }
}

/** Handles a request to /api/brief. */
export async function handleBrief(request, env) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'post-only' })

  /* Only this site's own pages may post here. */
  if (!sameSite(request)) return json(403, { ok: false, error: 'wrong-origin' })
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return json(415, { ok: false, error: 'json-only' })

  const body = await request.text()
  if (body.length > MAX_BYTES) return json(413, { ok: false, error: 'too-large' })

  let input
  try {
    input = JSON.parse(body)
  } catch {
    return json(400, { ok: false, error: 'not-json' })
  }

  const result = readBrief(input)
  if (result.robot) return json(200, { ok: true })
  if (result.error) return json(400, { ok: false, error: result.error })

  /* Until the inbox and the sending address are set up in Cloudflare, say so plainly rather than pretend. */
  if (!env.EMAIL || !env.BRIEF_TO || !env.BRIEF_FROM) return json(503, { ok: false, error: 'not-set-up' })

  try {
    await env.EMAIL.send(asEmail(result.brief, { to: env.BRIEF_TO, from: env.BRIEF_FROM }))
    return json(200, { ok: true })
  } catch (error) {
    /* The reason goes to the Worker's log, not to the visitor. */
    console.error('brief not sent:', error?.code ?? 'unknown', error?.message ?? error)
    return json(502, { ok: false, error: 'not-sent' })
  }
}
