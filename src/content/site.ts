/*
 * Studio-wide settings: name, navigation, where inquiries go, and the business
 * facts the legal pages need.
 *
 * Anything left empty is left off the site. Fill in only what is real.
 */
import type { ExternalLink } from './types.ts'

export const site = {
  name: 'Praamix',
  descriptor: 'Original games and game development',
  description:
    'Praamix is an independent game studio making Sheriff Town VR, a VR sandbox where you bring them in alive. We also develop games for clients with Unity and Unreal Engine.',
  /** The site's public address once it has one, e.g. 'https://example.com'. Empty until then. */
  url: '',
}

export const nav = [
  { label: 'Games', to: '/games/sheriff-town-vr', match: '/games' },
  { label: 'Services', to: '/services', match: '/services' },
  { label: 'Studio', to: '/studio', match: '/studio' },
  { label: 'Contact', to: '/contact', match: '/contact' },
]

export const legalNav = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
]

/*
 * Where project inquiries go. Set ONE of these to switch the contact form on.
 *   endpoint  the address of a form service that accepts a JSON POST and
 *             answers with a success status. Name the service in `provider`,
 *             because the Privacy Policy has to say who handles the data.
 *   email     a real inbox. The form then opens the visitor's own email app.
 * While both are empty the form is shown as an unconnected draft and sends nothing.
 */
export const inquiry = {
  endpoint: '',
  provider: '',
  email: '',
}

/** A real address for player support. Empty hides it. */
export const support = { email: '' }

/** Real studio profiles only, e.g. { label: 'YouTube', url: 'https://…' }. */
export const social: ExternalLink[] = []

/*
 * Business facts for the Terms & Conditions and Privacy Policy. While any of
 * the first six are empty, or the text has not had legal review, both pages
 * are shown as drafts and kept out of search results.
 */
export const business = {
  /** The registered or trading name of the business that runs the site. */
  legalName: '',
  address: '',
  /** The country whose law governs the terms, as it should read in a sentence. */
  governingLaw: '',
  legalContactEmail: '',
  privacyContactEmail: '',
  /** The company that hosts the site, once it is hosted. */
  hostingProvider: '',
  /** A full sentence on how long server logs and inquiries are kept. */
  retention: '',
  /** A full sentence on children and age limits, if any apply. */
  childrenNote: '',
  /** The day the current drafts were written, as YYYY-MM-DD. */
  legalDraftDate: '2026-11-15',
  /** The day the pages take effect, as YYYY-MM-DD. Set at publication. */
  legalEffectiveDate: '',
  /** Change to true only after a lawyer has reviewed both pages. */
  legalReviewed: false,
}

export function inquiryMode(): 'endpoint' | 'email' | 'draft' {
  if (inquiry.endpoint) return 'endpoint'
  if (inquiry.email) return 'email'
  return 'draft'
}

export function legalIsDraft(): boolean {
  const required = [
    business.legalName,
    business.governingLaw,
    business.legalContactEmail,
    business.privacyContactEmail,
    business.hostingProvider,
    business.legalEffectiveDate,
  ]
  return !business.legalReviewed || required.some((value) => value === '')
}

/** The button in the header. It only offers to start a project when inquiries can be sent. */
export function headerAction() {
  return inquiryMode() === 'draft'
    ? { label: 'Explore our services', to: '/services' }
    : { label: 'Start a project', to: '/contact' }
}

/** The button that leads to the project brief. */
export function briefAction() {
  return {
    label: inquiryMode() === 'draft' ? 'See the project brief' : 'Discuss your project',
    to: '/contact',
  }
}
