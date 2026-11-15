/*
 * Services page: the opening and the nine production stages.
 * The rest of the page is in services-scope.ts.
 */

type Stage = {
  title: string
  summary: string
  work: string
  deliverables: string[]
}

export const servicesIntro = {
  title: ['Your game.', 'Our full pipeline.'],
  lede: 'Unity and Unreal Engine development, from concept to launch.',
  options: 'Hand us the whole production, a single stage, or a project that is already under way.',
}

export const pipeline = {
  heading: 'From an idea to a playable build.',
  lede: 'Scope, milestones and target devices are agreed around your project. Open a stage to see the work and what it typically produces.',
  deliverablesLabel: 'Typical deliverables',
}

export const stages: Stage[] = [
  {
    title: 'Discovery and planning',
    summary: 'Work out what to build, and whether it holds up.',
    work: 'We look at your goals, your audience and the platforms you have in mind, then test the idea for feasibility and size.',
    deliverables: [
      'Agreed goals and audience',
      'Platform choices',
      'Feasibility notes',
      'Scope and game design documentation',
      'A proposed delivery plan',
    ],
  },
  {
    title: 'Game design and prototyping',
    summary: 'Prove the core of the game before building the rest.',
    work: 'We define the core loop, mechanics, controls and progression, and test them with prototypes you can play.',
    deliverables: [
      'Core loop and mechanics',
      'Control scheme',
      'Progression outline',
      'Interaction prototypes',
      'A playable proof of concept',
    ],
  },
  {
    title: 'Art direction and production',
    summary: 'Set the look, then produce it.',
    work: 'Art is scoped to what the game needs, in 2D or 3D, from the first concept sketches to finished scenes.',
    deliverables: [
      'Concept art and art direction',
      '2D art, 3D modelling and sculpting',
      'UVs, materials and textures',
      'Rigging and animation',
      'Environments, characters and props',
      'UI assets, lighting and VFX',
    ],
  },
  {
    title: 'Engineering',
    summary: 'Build the game in Unity or Unreal Engine.',
    work: 'We implement the systems the design calls for, in Unity with C# or in Unreal Engine with Blueprints and C++.',
    deliverables: [
      'Gameplay systems',
      'Physics and AI',
      'UI and UX implementation',
      'Input and saving',
      'Tools for the team',
      'Platform integration the project needs',
    ],
  },
  {
    title: 'Multiplayer and connected features',
    summary: 'Networking and online services, when the project includes them.',
    work: 'Connected features are scoped as part of the project. They are not assumed.',
    deliverables: ['Networking', 'Backend and account services', 'Leaderboards', 'Related connected systems'],
  },
  {
    title: 'Audio implementation',
    summary: 'Sound and music, in the game and mixed.',
    work: 'We define the sound and music requirements, implement and mix them, and coordinate licensed or commissioned audio as the project requires.',
    deliverables: [
      'Sound and music requirements',
      'Audio implementation',
      'Mixing',
      'Coordination of licensed or commissioned audio',
    ],
  },
  {
    title: 'Optimisation and QA',
    summary: 'Make it run well on the devices you are targeting.',
    work: 'We set performance budgets, profile against them, fix bugs and test on the target devices.',
    deliverables: [
      'Performance budgets and profiling',
      'Bug fixing',
      'Compatibility, input and device coverage',
      'Accessibility and usability checks',
      'Test builds for target devices',
    ],
  },
  {
    title: 'Release and publishing support',
    summary: 'Prepare the build and the store submission.',
    work: 'We prepare builds and store materials and support the submission. Store approval and console certification are decided by the platform holders, so they can’t be guaranteed.',
    deliverables: [
      'Release builds',
      'Store materials and integration',
      'Submission support',
      'Platform requirement checks',
    ],
  },
  {
    title: 'After launch',
    summary: 'Keep the game maintained and growing.',
    work: 'Support after release is scoped and agreed for each project.',
    deliverables: ['Maintenance and updates', 'Porting', 'Live operations', 'Additional content'],
  },
]

export const artProduction = {
  heading: 'How an asset comes together.',
  lede: 'One prop, followed through art production. This shows the art stage only. Engineering, testing and release are separate stages above.',
  /* Each label sits under its stage in the picture. `at` is the position across the picture. */
  labels: [
    { text: 'Concept sketch', at: '13%' },
    { text: 'Wireframe', at: '34%' },
    { text: 'Materials', at: '54%' },
    { text: 'Scene assembly', at: '82%' },
  ],
  character: {
    heading: 'Characters, rigging and animation.',
    body: [
      'Characters go through the same progression, with rigging and animation added: concept drawings, a finished model, then a rig that can be posed and animated.',
      'The studio artwork on this site is one style. The art direction for your game follows your game.',
    ],
  },
}
