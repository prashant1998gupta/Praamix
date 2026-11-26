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
    'Praamix is an independent game studio making Sheriff Town VR, a VR physics sandbox game for Meta Quest and PC VR. We also develop VR, mobile and PC games for clients with Unity and Unreal Engine.',
  /** The site's public address. Used for link previews, the sitemap and search engines. */
  url: 'https://praamix.com',
}

/*
 * Personal portfolio pages hosted on the same address. Each is a folder of
 * plain files in public/, separate from the studio site: public/prashant is
 * served at /prashant/. They are their owners' own pages, not studio pages.
 */
export const portfolios = ['prashant', 'aman']

export const nav = [
  { label: 'Games', to: '/games/sheriff-town-vr', match: '/games' },
  { label: 'Services', to: '/services', match: '/services' },
  { label: 'Studio', to: '/studio', match: '/studio' },
  { label: 'Contact', to: '/contact', match: '/contact' },
]

export const legalNav = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Sheriff Town VR Privacy', to: '/games/sheriff-town-vr/privacy-policy' },
  { label: 'Player support', to: '/support' },
  { label: 'Press kit', to: '/games/sheriff-town-vr/press-kit' },
  { label: 'Devlog', to: '/devlog' },
]

/*
 * Where project inquiries go. Set ONE of these to switch the contact form on.
 *   endpoint  the address of a form service that accepts a JSON POST and
 *             answers with a success status. Name the service in `provider`,
 *             because the Privacy Policy has to say who handles the data.
 *             The site's own is '/api/brief', run by Cloudflare from worker/.
 *   email     a real inbox. The form then opens the visitor's own email app.
 * While both are empty the form is shown as an unconnected draft and sends nothing.
 */
export const inquiry = {
  /* The site's own server code (worker/), which emails each brief to the inbox set as BRIEF_TO in Cloudflare. */
  endpoint: '/api/brief',
  provider: 'Cloudflare',
  email: '',
  /** The company whose email service the briefs arrive in, e.g. 'Google'. The Privacy Policy names it. */
  inbox: 'Google',
}

/** A real address for player support. Empty hides it. */
export const support = { email: 'hello@praamix.com' }

/*
 * Real profiles only. These belong to Sheriff Town VR, the studio's game.
 * The Discord address must be an invite that never expires: one made with
 * Discord's default settings stops working after a while, and the link here
 * would then lead nowhere.
 */
export const channels = {
  youtube: 'https://www.youtube.com/@SheriffTownVR',
  discord: 'https://discord.gg/YaxSWmB8G6',
}

/** The links in the footer. */
export const social: ExternalLink[] = [
  { label: 'YouTube', url: channels.youtube },
  { label: 'Discord', url: channels.discord },
]

/*
 * Business facts for the Terms & Conditions and Privacy Policy. While any of
 * the first six are empty, or the text has not had legal review, both pages
 * are shown as drafts and kept out of search results.
 */
export const business = {
  /** The registered or trading name of the business that runs the site. */
  legalName: 'Praamix Studio',
  address: 'India',
  /** The country whose law governs the terms, as it should read in a sentence. */
  governingLaw: 'India',
  legalContactEmail: 'hello@praamix.com',
  privacyContactEmail: 'hello@praamix.com',
  /** The company that hosts the site, once it is hosted. */
  hostingProvider: 'Cloudflare',
  /** A full sentence on how long server logs and inquiries are kept. */
  retention:
    'Server logs are kept by Cloudflare under its own retention rules, usually for a short period. Project inquiries are kept in our email only for as long as we need them to discuss the project, and are deleted sooner if you ask.',
  /** A full sentence on children and age limits, if any apply. */
  childrenNote:
    'This website is meant for adults and businesses looking for game development services. We do not knowingly collect personal information from anyone under 18. If you believe a child has sent us information, write to hello@praamix.com and we will delete it.',
  /** The day the current drafts were written, as YYYY-MM-DD. */
  legalDraftDate: '2026-11-15',
  /** The day the pages take effect, as YYYY-MM-DD. Set at publication. */
  legalEffectiveDate: '2026-11-18',
  /**
   * True once the owner has approved both pages for publication. Set by the
   * owner on 2026-11-18. The text has not had review by a lawyer: arrange one
   * before relying on it in a dispute.
   */
  legalReviewed: true,
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
