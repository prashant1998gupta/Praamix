/* Services page: how a project runs, client questions and the closing line. */
import type { Faq } from './types.ts'

export const journey = {
  heading: 'How a project runs.',
  steps: [
    { title: 'Inquiry', text: 'You send a short brief about the game.' },
    { title: 'Discovery', text: 'We go through goals, audience, platforms and constraints together.' },
    { title: 'Scope and proposal', text: 'You get a scope, a plan and a proposal to decide on.' },
    { title: 'Agreed milestones', text: 'We agree the milestones and put them in the project agreement.' },
    { title: 'Prototype and reviews', text: 'You play early builds and review them with us.' },
    { title: 'Production and testing', text: 'The game is built and tested on the target devices.' },
    { title: 'Delivery and support', text: 'We hand over what was agreed, and support it as agreed.' },
  ],
  handoff: {
    heading: 'What you receive.',
    text: 'Typical handoff items are the agreed source files, build artifacts, assets and documentation, and deployment guidance. What is included is set out in the signed agreement.',
  },
}

const questions: Faq[] = [
  {
    question: 'Can we start with just an idea?',
    answer:
      'Yes. Discovery and planning is the first stage of the pipeline. It turns an idea into goals, a scope and a delivery plan you can make decisions from.',
  },
  {
    question: 'Can you join a project that is already in development?',
    answer:
      'Yes. We can take on a particular stage or join an existing project. We start by reviewing the current state of the game so the scope is realistic.',
  },
  {
    question: 'Unity or Unreal Engine: how do we choose?',
    answer:
      'We work in both, so the choice follows the game: its requirements, target platforms, visual goals, any existing codebase and the performance budget. If you are unsure, choose “Help me choose” in the project brief.',
  },
  {
    question: 'Can you handle just one part of the pipeline?',
    answer:
      'Yes. You can bring us in for a single stage, such as art production, engineering or optimisation, or for the whole production.',
  },
  {
    question: 'Which platforms should we target?',
    answer:
      'That depends on your audience and budget. We settle the actual devices and test coverage with you during discovery. Console work depends on the relevant developer access and platform requirements.',
  },
  {
    question: 'How long will it take, and what will it cost?',
    answer:
      'Both depend on scope, so we don’t publish fixed prices or timelines. After discovery you get a proposal with milestones, timing and cost for the scope we have agreed.',
  },
  {
    question: 'Who owns the source code and IP?',
    answer:
      'Rights are set out in the project agreement, including source code, assets and any third-party licences involved. They are agreed before production starts.',
  },
  {
    question: 'Do you offer support after launch?',
    answer:
      'Yes, when it is part of the agreement. Maintenance, updates, porting, live operations and additional content are scoped per project.',
  },
]

export const servicesFaq = {
  heading: 'Client questions.',
  items: questions,
}

export const servicesClosing = {
  title: 'Let’s build your game together.',
  text: 'Tell us what you are making and where it should run.',
}
