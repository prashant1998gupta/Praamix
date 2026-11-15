/* Studio page copy. Unknown facts about the studio stay out: no location, history, team size or awards. */

export const studio = {
  eyebrow: 'Studio',
  title: ['We make games.', 'Ours, and yours.'],
  lede: 'Praamix builds original games and develops games with clients. One studio, two kinds of work.',

  make: {
    heading: 'What we make.',
    items: [
      {
        title: 'Original games',
        text: 'Games we design and build ourselves. The first is Sheriff Town VR, a VR sandbox where you play the sheriff of a town. It is in development.',
        action: 'See Sheriff Town VR',
        to: '/games/sheriff-town-vr',
      },
      {
        title: 'Client development',
        text: 'Games built with and for clients in Unity and Unreal Engine, from one production stage to the full pipeline, across mobile, PC, web, console and XR.',
        action: 'Explore our services',
        to: '/services',
      },
    ],
  },

  /* The strip of in-game captures under the opening. */
  bench: {
    eyebrow: 'On the workbench',
    heading: 'Sheriff Town VR, in development.',
    action: 'See the game',
  },

  approach: {
    heading: 'How we work with you.',
    lede: 'A project moves through five steps, and you can see where it stands at each one.',
    steps: [
      {
        title: 'Define the goal',
        text: 'What the game is for, who it is for, and what a good result looks like.',
      },
      {
        title: 'Agree the scope and target devices',
        text: 'What gets built, and which devices it has to run on.',
      },
      {
        title: 'Review prototypes',
        text: 'You play early versions, and we adjust before the larger production work begins.',
      },
      {
        title: 'Work through agreed milestones',
        text: 'Production runs in the milestones we agreed, each with something to review.',
      },
      {
        title: 'Verify the delivery',
        text: 'What is delivered is checked against what was agreed, on the target devices.',
      },
    ],
  },

  discuss: {
    heading: 'What we will talk about first.',
    items: [
      { title: 'The game', text: 'What it is, who it is for and how far along it is.' },
      { title: 'Where it runs', text: 'Platforms, target devices and the engine.' },
      { title: 'The size of it', text: 'Scope, milestones, a budget range and timing.' },
      {
        title: 'The terms',
        text: 'Rights, source code, third-party licences and support. These go into the project agreement.',
      },
    ],
  },

  closing: {
    title: 'Have a game in mind?',
    text: 'See what we can take on and how a project runs.',
  },
}
