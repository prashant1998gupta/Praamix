/*
 * Player support for Sheriff Town VR: where to get help, how to report a bug,
 * and answers to common questions.
 *
 * The settings named here are the game's real ones, checked against
 * `Scripts/Core/Settings/SettingIds.cs` in the Unity project on 18 November
 * 2026: posture (standing or seated), height calibration, turning (smooth,
 * snap or off), motion vignette, left-handed, text size, subtitles, blood,
 * picture quality and the volume sliders. If a setting is renamed or removed,
 * change this file. Never describe a setting the game does not have.
 *
 * This page's address is given as the support link on the game's Meta Horizon
 * Store page: do not move it.
 */
import type { Faq } from './types.ts'
import { channels } from './site.ts'

export const supportEmail = 'hello@praamix.com'

export const support = {
  eyebrow: 'Sheriff Town VR',
  heading: 'Player support.',
  lede: 'Stuck, found a bug, or feeling unwell in VR? Here is how to get help. A real person at the studio reads every message.',

  ways: [
    {
      icon: 'mail' as const,
      name: 'Email',
      title: supportEmail,
      text: 'Best for bugs, refund questions and anything about your account or your information.',
      action: 'Email us',
      url: `mailto:${supportEmail}?subject=${encodeURIComponent('Sheriff Town VR support')}`,
      external: false,
    },
    {
      icon: 'chat' as const,
      name: 'Discord',
      title: 'The Sheriff Town VR server',
      text: 'Ask other players, share what you built, and tell us what you think.',
      action: 'Join the Discord',
      url: channels.discord,
      external: true,
    },
  ],

  bug: {
    heading: 'Reporting a bug',
    lede: 'The more we know, the faster we can fix it. Please tell us:',
    points: [
      'which headset you play on',
      'which map you were on and what you were doing',
      'what happened, and what you expected to happen',
      'whether it happens every time, or only sometimes',
      'a short video or screenshot, if you can. Quest headsets can record one from the Meta button menu.',
    ],
  },

  faqHeading: 'Common questions.',
  faq: [
    {
      question: 'I feel sick or dizzy when I move. What can I change?',
      answer:
        'Open the game’s settings. Switch turning from smooth to snap, or off if you prefer to turn your body. Switch on the motion vignette, which darkens the edges of your view while you move. You can also play seated. If you still feel unwell, take the headset off and rest: comfort in VR often improves over a few short sessions.',
    },
    {
      question: 'Can I play sitting down?',
      answer:
        'Yes. Set your posture to seated in the settings, then calibrate your height so you can reach things on the ground and on tables.',
    },
    {
      question: 'I’m left-handed. Can I swap the controls?',
      answer: 'Yes. Switch on left-handed in the settings.',
    },
    {
      question: 'The text is hard to read, or I can’t follow what people say.',
      answer: 'You can make the menus and text bigger in the settings, and switch subtitles on for every voiced line.',
    },
    {
      question: 'Can I turn the blood off?',
      answer: 'Yes. Blood can be switched off in the settings.',
    },
    {
      question: 'My headset gets warm or the battery drains quickly.',
      answer:
        'Set picture quality to the battery-saving option in the settings. It lowers the detail a little and makes the headset work less hard.',
    },
    {
      question: 'How do I get a refund?',
      answer:
        'Purchases are made through the Meta Horizon Store, so refunds are handled by Meta under its own refund policy. You can request one from your purchase history in the Meta Horizon app or on meta.com. We can’t issue refunds ourselves.',
    },
    {
      question: 'Where is my progress saved? Will I lose it if I reinstall?',
      answer:
        'Your settings, favourites, best times and saved builds are kept on your headset. Uninstalling the game deletes them, so a fresh install starts from scratch.',
    },
    {
      question: 'Is there multiplayer?',
      answer: 'Not yet. Multiplayer is planned. We will announce it on Discord and YouTube when it is ready.',
    },
    {
      question: 'What does the game do with my information?',
      answer:
        'Nothing leaves your headset: the game has no accounts, no analytics and no online features. The full details are in the Sheriff Town VR privacy policy.',
    },
  ] satisfies Faq[],
}
