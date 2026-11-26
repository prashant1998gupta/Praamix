/*
 * Sheriff Town VR Privacy Policy.
 *
 * Written from what the game's own code does, checked in the Unity project
 * on 18 November 2026:
 *   - it has no network code, no analytics, no crash reporting and no ads
 *     (Unity Analytics, Crash Reporting and Performance Reporting are off)
 *   - it reads no Meta user ID, name, friends or profile
 *
 * Since build 0.1.0 (code 18, uploaded 2026-11-25) the Meta Quest build also
 * runs the store entitlement check (StoreEntitlementCheck.cs, ADR-359): once
 * at launch it asks the headset's Meta platform service whether the signed-in
 * account owns the game, gets back yes or no, and closes the game on a no.
 * It calls only Entitlements.IsUserEntitledToApplication; it reads no user
 * details and sends nothing to us. The PC VR build has no check.
 *   - it does not use the microphone or the camera
 *   - it saves settings, spawn favourites, challenge best times and the Copy
 *     Paste gun's saved builds in files on the headset only
 *
 * If the game starts doing anything else (multiplayer, accounts, online
 * leaderboards, analytics, voice chat, more of the Meta Platform SDK), this file must
 * change before that version is released.
 */
import type { LegalSection } from './legal.ts'
import { channels } from './site.ts'

export const gamePrivacy = {
  game: 'Sheriff Town VR',
  /** Who makes the game, as named on its store page. */
  studio: 'Praamix Studio',
  contact: 'hello@praamix.com',
  /** The day this text was last changed, as YYYY-MM-DD. */
  updated: '2026-11-27',
}

const { game, studio, contact } = gamePrivacy

export const gamePrivacyIntro = `This policy explains what ${game} does with information about the people who play it. In short: the game collects no personal information, and nothing you do in it leaves your headset. The one thing it checks online, with Meta, is whether your account owns the game.`

export function gamePrivacySections(): LegalSection[] {
  return [
    {
      id: 'who',
      heading: 'Who we are',
      blocks: [
        { p: `${game} is made by ${studio} (Praamix). In this policy, “we” means ${studio}.` },
        { p: `You can reach us about this policy or your information at ${contact}.` },
      ],
    },
    {
      id: 'collect',
      heading: 'What the game collects',
      blocks: [
        { p: `${game} does not collect, store on our servers, or share any personal information. In particular, the game:` },
        {
          list: [
            'has no accounts and does not ask for your name, email address or age',
            'does not read your Meta account details, user ID, friends list or profile',
            'does not use the headset’s microphone or cameras',
            'does not record your voice, your surroundings, your body or hand movements, or your eyes',
            'sends no analytics, usage statistics or crash reports',
            'shows no advertising and contains no advertising or tracking code',
            'has no online play, chat or leaderboards',
          ],
        },
      ],
    },
    {
      id: 'device',
      heading: 'What the game saves on your headset',
      blocks: [
        { p: 'So that the game remembers your progress and choices, it saves a few small files on your headset:' },
        {
          list: [
            'your settings, such as comfort, movement and sound options',
            'the items you mark as favourites',
            'your best times in challenge mode',
            'the builds you save with the Copy Paste gun',
          ],
        },
        { p: 'These files stay on your device. They are never sent to us or to anyone else, and we cannot see them. Uninstalling the game, or clearing its data in your headset’s settings, deletes them.' },
      ],
    },
    {
      id: 'meta',
      heading: 'Meta and the Meta Horizon Store',
      blocks: [
        { p: `When ${game} starts on a Meta Quest headset, it asks Meta’s own service on the headset whether the Meta account signed in owns the game. This is the standard purchase check Meta asks every store app to make. The game receives only a yes or a no; it does not receive your name, user ID or any other account details, and the answer is not sent to us or stored. If the answer is no, the game shows a short message and closes. The PC VR version does not make this check.` },
        { p: `You get ${game} through Meta’s store and play it on a Meta Quest headset. Meta collects information about your account, purchases and use of its platform under its own privacy policy, which you can read at meta.com/legal/quest/privacy-policy. We do not control that, and we do not receive personal information about you from Meta beyond what the store provides to every developer, such as overall sales and download figures that do not identify you.` },
      ],
    },
    {
      id: 'contact',
      heading: 'If you contact us',
      blocks: [
        { p: `If you email us, or write to us on our Discord server (${channels.discord}) or YouTube channel, we receive what you send, such as your email address or username and your message. We use it only to reply to you and to improve the game. We keep emails only as long as needed to deal with them, and you can ask us to delete them at any time.` },
      ],
    },
    {
      id: 'rights',
      heading: 'Your choices and rights',
      blocks: [
        { p: 'Because the game collects no personal information, there is nothing about you that we hold from playing it. To remove the information the game saves on your headset, uninstall the game or clear its data.' },
        { p: `If you have contacted us and want to know what we hold, or want it corrected or deleted, write to ${contact} and we will act on it within 30 days.` },
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      blocks: [
        { p: `${game} collects no personal information from anyone, including children. Meta Quest headsets and accounts have their own age requirements, set by Meta. If you believe a child has sent us personal information by email or on our community channels, contact us at ${contact} and we will delete it.` },
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      blocks: [
        { p: 'The game sends nothing to us. The only online request it makes is the purchase check described above, which goes from your headset to Meta’s own service and carries no information you type or create. The files the game saves are protected by your headset’s own security.' },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        { p: 'If a future version of the game starts handling information differently, for example by adding online multiplayer, we will update this policy before that version is released and change the date at the top of this page.' },
        { p: `This policy covers the ${game} game. The Praamix website has its own privacy policy at praamix.com/privacy-policy.` },
      ],
    },
  ]
}
