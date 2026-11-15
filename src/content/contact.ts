/*
 * Contact page: the project brief.
 *
 * Where the brief is sent is set in site.ts (`inquiry`). Until a destination
 * is set there, the page shows the form as an unconnected draft and sends
 * nothing.
 */

export const contact = {
  eyebrow: 'Contact',
  heading: 'Tell us about your game.',
  lede: 'A short brief is enough to start. It is not a contract, and sending it doesn’t commit you to anything.',

  draft: {
    title: 'Draft — this form is not connected yet',
    text: 'You can fill it in and check it, but nothing is sent or stored. It needs an inquiry destination before it can be used.',
  },

  groups: {
    you: 'About you',
    project: 'The project',
    planning: 'Planning',
  },

  fields: {
    name: 'Your name',
    email: 'Email address',
    company: 'Company or studio',
    summary: 'What are you making?',
    summaryHint: 'A few sentences: the idea, who it is for, and how far along it is.',
    gameType: 'Game type',
    platforms: 'Target platforms',
    platformsHint: 'Choose any that apply.',
    engine: 'Preferred engine',
    budget: 'Budget range',
    budgetHint: 'A rough range helps us suggest a realistic scope. These are not prices.',
    timeframe: 'Timeframe',
  },

  /* The lists below are suggestions for the visitor to pick from. Edit them freely. */
  gameTypes: [
    'Casual or hypercasual',
    'Puzzle or arcade',
    'Action or adventure',
    'Shooter',
    'RPG',
    'Racing or sports',
    'Strategy or simulation',
    'Educational or serious game',
    'Something else',
    'Not sure yet',
  ],
  platforms: ['Mobile', 'PC', 'Web', 'Console', 'VR', 'AR or mixed reality', 'Not sure yet'],
  engines: ['Unity', 'Unreal Engine', 'Help me choose'],
  budgets: ['Under $10,000', '$10,000 to $50,000', '$50,000 to $150,000', 'Over $150,000', 'Not sure yet'],
  timeframes: [
    'As soon as possible',
    'Within 3 months',
    '3 to 6 months',
    '6 to 12 months',
    'More than a year',
    'Flexible',
  ],

  errors: {
    name: 'Enter your name.',
    email: 'Enter an email address we can reply to, like name@example.com.',
    summary: 'Tell us a little about the game. A sentence or two is enough.',
  },

  actions: {
    check: 'Check this brief',
    send: 'Send inquiry',
    sending: 'Sending…',
  },

  status: {
    checked:
      'This brief is complete. It was not sent: the form is not connected to an inbox yet.',
    sent: 'Your brief was sent. Thank you. We will reply by email.',
    mail: 'Your email app should have opened with the brief filled in. It is sent only when you press send there.',
    failed:
      'The brief could not be sent. Your answers are still in the form, so you can try again.',
  },

  /* Shown next to the send button. The wording follows what the form really does. */
  privacy: {
    draft: 'Nothing you type here leaves this page while the form is unconnected.',
    live: 'We use what you send to reply to you and discuss the project.',
    link: 'Privacy Policy',
  },

  /* What follows a brief. No timings are promised here. */
  next: {
    label: 'What happens next',
    steps: [
      { title: 'You send a brief', text: 'A few sentences are enough.' },
      { title: 'We talk it through', text: 'Goals, platforms and constraints.' },
      { title: 'You get a scope', text: 'A plan and a proposal to decide on.' },
    ],
  },

  /* The live summary beside the form. */
  file: {
    heading: 'Project file',
    essentials: 'Essentials',
    ready: 'Ready to go',
    empty: 'Not answered yet',
    rows: {
      client: 'Client',
      reply: 'Reply to',
      game: 'The game',
      type: 'Type',
      platforms: 'Platforms',
      engine: 'Engine',
      budget: 'Budget',
      timeframe: 'Timeframe',
    },
  },

  aside: {
    heading: 'What a brief is for.',
    points: [
      'It starts a conversation. Work only begins under a separate written agreement.',
      'You don’t need a finished design. An idea and a target platform are enough.',
      'Leave out anything confidential. We don’t ask for documents at this stage.',
    ],
    supportHeading: 'Player support',
  },
}
