/* The project brief: what it holds, how it is checked, and how it is delivered. */
import { contact } from '../content/contact.ts'
import { inquiry, inquiryMode } from '../content/site.ts'

export type Brief = {
  name: string
  email: string
  company: string
  summary: string
  gameType: string
  platforms: string[]
  engine: string
  budget: string
  timeframe: string
}

export type BriefErrors = Partial<Record<'name' | 'email' | 'summary', string>>

/**
 * idle     nothing to report
 * checked  the brief is complete, and was not sent because the form is unconnected
 * sending  waiting for the form service
 * sent     the form service accepted it
 * mail     the visitor's email app was opened with the brief filled in
 * failed   the form service refused it, or could not be reached
 */
export type BriefStatus = 'idle' | 'checked' | 'sending' | 'sent' | 'mail' | 'failed'

export const EMPTY_BRIEF: Brief = {
  name: '',
  email: '',
  company: '',
  summary: '',
  gameType: '',
  platforms: [],
  engine: '',
  budget: '',
  timeframe: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Only three answers are required: a name, an address to reply to, and a few words about the game. */
export function validate(brief: Brief): BriefErrors {
  const errors: BriefErrors = {}
  if (!brief.name.trim()) errors.name = contact.errors.name
  if (!EMAIL.test(brief.email.trim())) errors.email = contact.errors.email
  if (brief.summary.trim().length < 10) errors.summary = contact.errors.summary
  return errors
}

/** The brief as plain text, one answer per line, leaving out anything unanswered. */
export function asText(brief: Brief): string {
  const labels = contact.fields
  const rows: [string, string][] = [
    [labels.name, brief.name],
    [labels.email, brief.email],
    [labels.company, brief.company],
    [labels.summary, brief.summary],
    [labels.gameType, brief.gameType],
    [labels.platforms, brief.platforms.join(', ')],
    [labels.engine, brief.engine],
    [labels.budget, brief.budget],
    [labels.timeframe, brief.timeframe],
  ]

  return rows
    .filter(([, answer]) => answer.trim() !== '')
    .map(([label, answer]) => `${label}: ${answer.trim()}`)
    .join('\n')
}

/**
 * Two things sent with a brief that help the receiving end tell a person from
 * a robot: the hidden field, which a person never sees and so leaves empty,
 * and how long the form was open.
 */
export type BriefProof = { website: string; elapsed: number }

/**
 * Delivers a brief that has already passed validation, and reports what
 * really happened. It never reports a delivery that did not take place.
 */
export async function deliver(brief: Brief, proof: BriefProof): Promise<BriefStatus> {
  const mode = inquiryMode()

  if (mode === 'draft') return 'checked'

  if (mode === 'email') {
    const subject = encodeURIComponent(`Project inquiry from ${brief.name.trim()}`)
    const body = encodeURIComponent(asText(brief))
    window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`
    return 'mail'
  }

  try {
    const response = await fetch(inquiry.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...brief,
        platforms: brief.platforms.join(', '),
        message: asText(brief),
        ...proof,
      }),
    })
    return response.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
