/*
 * Website Privacy Policy.
 *
 * A draft for the owner and a legal reviewer, written from what the website
 * really does. The statements in "What this website does" are checked against
 * the built site by `npm run check:responsive`. If the site starts doing
 * anything else (analytics, embeds, a connected form), change this file first.
 *
 * It covers the website only. It says nothing about any game.
 */
import { operatorBlock } from './legal.ts'
import type { LegalBlock, LegalSection } from './legal.ts'
import { business, inquiry, inquiryMode } from './site.ts'

export const privacyIntro =
  'This policy explains what this website does with information about the people who visit it.'

function inquiryBlocks(): LegalBlock[] {
  const mode = inquiryMode()

  if (mode === 'draft') {
    return [
      { p: 'The project inquiry form is not connected yet. What you type into it stays in your browser tab. It is not sent to us and it is not stored.' },
      { pending: 'How inquiries are delivered, and by which provider. This section must be rewritten when the form is connected.' },
    ]
  }

  if (mode === 'email') {
    return [
      { p: 'The inquiry form opens your own email app with your answers filled in. Nothing is sent until you send that email. When you do, we receive your email address and whatever the message contains.' },
      { p: 'We use it to reply to you and to discuss the project.' },
    ]
  }

  return [
    { p: 'If you send a project inquiry, we receive what you enter: your name, your email address, your company if you give it, and the details of your project.' },
    inquiry.provider
      ? { p: `The form is delivered by ${inquiry.provider}, which handles that information on our behalf.` }
      : { pending: 'The name of the provider that delivers the inquiry form.' },
    { p: 'We use it to reply to you and to discuss the project.' },
  ]
}

export function privacySections(): LegalSection[] {
  return [
    {
      id: 'scope',
      heading: 'What this policy covers',
      blocks: [
        { p: 'This policy covers this website only. It doesn’t cover our games. A game would have its own privacy policy, based on what that game actually does.' },
        operatorBlock(),
      ],
    },
    {
      id: 'site',
      heading: 'What this website does',
      blocks: [
        { p: 'The site is a set of static pages. As built, its own code:' },
        {
          list: [
            'sets no cookies',
            'stores nothing in your browser’s local or session storage',
            'loads no analytics, advertising or tracking scripts',
            'loads nothing from another company’s service as a page opens: no videos, maps or social widgets',
            'serves its fonts and images from the same site, not from an outside service',
          ],
        },
        {
          p: 'To load quickly and keep working without a connection, the site saves a copy of its own pages, pictures and code on your device. That copy holds nothing about you. Clearing this site’s data in your browser removes it.',
        },
        {
          p: 'The Sheriff Town VR trailer is a YouTube video. It is not loaded with the page. If you press play, the player is loaded from YouTube, a Google service, using its privacy-enhanced address (youtube-nocookie.com). YouTube then receives the technical details any website receives when you use it, such as your IP address and browser details, and its own privacy policy applies. Closing the player removes it from the page.',
        },
        {
          p: 'The personal portfolio pages at /prashant and /aman are their owners’ own pages, not part of the studio site, and work differently. They load fonts from Google, and their small browser games use Google Firebase for scoreboards and your browser’s storage to remember settings and scores.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting and server logs',
      blocks: [
        { p: 'Any web host keeps technical logs of the requests it serves. These typically include the IP address, the date and time, the page requested and browser details.' },
        business.hostingProvider
          ? { p: `This site is hosted by ${business.hostingProvider}, which handles those logs on our behalf.` }
          : { pending: 'The hosting provider, what it logs and for how long. A provider has not been chosen yet.' },
      ],
    },
    { id: 'inquiries', heading: 'Project inquiries', blocks: inquiryBlocks() },
    {
      id: 'sharing',
      heading: 'Who else is involved',
      blocks: [
        { p: 'The site has no advertising or data-broker integrations.' },
        { p: 'Service providers that keep the site running, such as the web host and any inquiry-form provider, handle information on our behalf.' },
        ...(business.hostingProvider ? [] : [{ pending: 'The names of those service providers.' }]),
      ],
    },
    {
      id: 'retention',
      heading: 'How long information is kept',
      blocks: [
        business.retention
          ? { p: business.retention }
          : { pending: 'Retention periods for server logs and inquiries. None have been set yet.' },
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      blocks: [
        { p: 'The site is static and has no accounts or passwords, which limits what can go wrong. No website can promise perfect security.' },
      ],
    },
    {
      id: 'rights',
      heading: 'Your choices and rights',
      blocks: [
        { p: 'You can browse the site without giving us any information. You decide what to put in an inquiry.' },
        business.privacyContactEmail
          ? { p: `To ask what information we hold about you, or to have it corrected or deleted, write to ${business.privacyContactEmail}.` }
          : { pending: 'A privacy contact address, and the legal rights that apply. Those depend on the confirmed country of the business and need legal review.' },
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      blocks: [
        business.childrenNote
          ? { p: business.childrenNote }
          : { pending: 'Whether any age-related rules apply to this website. This will be assessed in legal review.' },
      ],
    },
    {
      id: 'links',
      heading: 'Links to other sites',
      blocks: [
        { p: 'Links to portfolios, storefronts, YouTube, Discord and other sites take you to services with their own privacy policies.' },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        { p: 'If the website starts doing anything this policy doesn’t describe, the policy will be updated to say so. The date at the top of the page shows the latest version.' },
      ],
    },
  ]
}
