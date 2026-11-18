/*
 * Website Terms & Conditions.
 *
 * Written from what the website actually does and from the business facts in
 * site.ts, and approved by the owner for publication on 2026-11-18. It has
 * not been reviewed by a lawyer. Where a fact is missing, the page shows a
 * marked "not yet confirmed" note instead of inventing one. It sets no
 * payment terms or refund promises: those belong in each client agreement.
 */
import { business } from './site.ts'

export type LegalBlock = { p: string } | { list: string[] } | { pending: string }
export type LegalSection = { id: string; heading: string; blocks: LegalBlock[] }

/** Names the business that runs the site, or marks it as still to be confirmed. */
export function operatorBlock(): LegalBlock {
  if (!business.legalName) {
    return { pending: 'The legal name and address of the business that operates this website.' }
  }
  const where = business.address ? `, ${business.address}` : ''
  return { p: `This website is operated by ${business.legalName}${where}.` }
}

export const termsIntro =
  'These terms cover the use of this website. They are separate from any agreement for paid work and from any licence for a game.'

export function termsSections(): LegalSection[] {
  return [
    {
      id: 'about',
      heading: 'About these terms',
      blocks: [
        { p: 'This website presents Praamix, our original games and our game development services.' },
        operatorBlock(),
        { p: 'By using the site you agree to these terms. If you don’t agree with them, please don’t use the site.' },
      ],
    },
    {
      id: 'use',
      heading: 'Using this website',
      blocks: [
        { p: 'You are welcome to browse the site and to contact us about a project. Please don’t:' },
        {
          list: [
            'try to disrupt the site or reach parts of it that are not public',
            'use automated tools in a way that strains the site',
            'send unlawful, harmful or misleading material through the inquiry form',
            'pass yourself off as Praamix or suggest a connection with us that doesn’t exist',
          ],
        },
      ],
    },
    {
      id: 'content',
      heading: 'Content and ownership',
      blocks: [
        { p: 'Unless stated otherwise, the content of this site, including its text, logo, design, pictures, videos and 3D models, belongs to Praamix. You may view it and link to it. Please ask before reusing it elsewhere.' },
        { p: 'Each picture on the site is labelled with what it is: an in-game capture, an in-engine render, key art made for a game, or studio artwork. Studio artwork is illustration, not a screenshot of a game and not an example of client work.' },
        { p: 'The Sheriff Town VR models shown in the 3D viewer are the game’s own. Your browser downloads them in order to display them, but that does not give you a right to reuse them.' },
        { p: 'The typeface, Manrope, is used under the SIL Open Font License. Product, engine and platform names mentioned on the site are trademarks of their owners. Naming them doesn’t imply a partnership or an endorsement.' },
      ],
    },
    {
      id: 'information',
      heading: 'Game and service information',
      blocks: [
        { p: 'The site is for general information. Details about games in development, including features, platforms and timing, can change. A game described here is not available to buy until a store listing says so.' },
        { p: 'Descriptions of our services explain what we offer. They are not a quote and not a commitment to take on a particular project.' },
      ],
    },
    {
      id: 'inquiries',
      heading: 'Project inquiries are not contracts',
      blocks: [
        { p: 'Sending a project inquiry doesn’t create a paid engagement, and a reply from us doesn’t either. Work starts only under a separate written agreement.' },
        { p: 'That agreement, not this website, sets out:' },
        {
          list: [
            'scope and deliverables',
            'milestones',
            'payment',
            'how changes are handled',
            'ownership of intellectual property and source code',
            'third-party licences',
            'support',
            'cancellation and refunds',
            'liability and how disputes are resolved',
          ],
        },
      ],
    },
    {
      id: 'purchases',
      heading: 'Buying our games',
      blocks: [
        { p: 'This website doesn’t sell games or take payments. When a game is released, purchases are made through the store that lists it and follow that store’s terms.' },
        { p: 'Any licence for a game is provided with the game. These website terms are not a game licence.' },
      ],
    },
    {
      id: 'links',
      heading: 'Links to other sites',
      blocks: [
        { p: 'The site links to other websites and services, such as YouTube, Discord, game stores and the personal portfolios of the people behind Praamix. We don’t control them, and their own terms and privacy policies apply.' },
      ],
    },
    {
      id: 'liability',
      heading: 'Accuracy, liability and governing law',
      blocks: [
        { p: 'We take care to keep this site accurate, but it may contain errors or be out of date, and it may be unavailable at times. The site is provided as it is, for general information.' },
        { p: 'As far as the law allows, we are not responsible for any loss that comes from relying on information on this site or from it being unavailable. Nothing in these terms limits any right you have that the law does not allow to be limited.' },
        business.governingLaw
          ? { p: `These terms are governed by the laws of ${business.governingLaw}, and the courts of ${business.governingLaw} have jurisdiction over any dispute about them.` }
          : { pending: 'Liability terms and governing law. These depend on the confirmed country of the business and need legal review before they are written.' },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      blocks: [{ p: 'We may update these terms. The date at the top of the page shows the latest version.' }],
    },
    {
      id: 'contact',
      heading: 'Contact',
      blocks: [
        business.legalContactEmail
          ? { p: `Questions about these terms can be sent to ${business.legalContactEmail}.` }
          : { pending: 'A contact address for questions about these terms.' },
      ],
    },
  ]
}
