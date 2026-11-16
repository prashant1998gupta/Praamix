import type { IconName } from '../content/types.ts'

/* Simple line drawings on a 24 by 24 grid. Decorative: the text beside each one carries the meaning. */
const PATHS: Record<IconName, string[]> = {
  bulb: [
    'M9 18h6',
    'M10 21h4',
    'M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z',
  ],
  pencil: ['M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z', 'M14.5 6.5l3 3'],
  code: ['M8 7l-5 5 5 5', 'M16 7l5 5-5 5', 'M13.5 5l-3 14'],
  rocket: [
    'M12 15l-3-3c1-4.5 4.5-8 11-8 0 6.5-3.5 10-8 11Z',
    'M9 12l-4 .5L3 15l4 .5',
    'M12 15l-.5 4L9 21l-.5-4',
    'M15.5 8.5h.01',
  ],
  phone: ['M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', 'M11 18h2'],
  monitor: ['M4 5h16v11H4z', 'M9 20h6', 'M12 16v4'],
  globe: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
    'M3 12h18',
    'M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z',
  ],
  gamepad: [
    'M7 8h10a4 4 0 0 1 4 4v1.5a2.5 2.5 0 0 1-4.6 1.4L15.5 15h-7l-.9.9A2.5 2.5 0 0 1 3 13.5V12a4 4 0 0 1 4-4Z',
    'M8 10.5V13',
    'M6.75 11.75h2.5',
    'M16 11.5h.01',
  ],
  headset: [
    'M4 9h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-4l-2-2h-4l-2 2H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
    'M7 9V8a5 5 0 0 1 10 0v1',
  ],
  layers: ['M12 4l8 4-8 4-8-4 8-4Z', 'M4 12l8 4 8-4', 'M4 16l8 4 8-4'],
  external: ['M14 5h5v5', 'M19 5l-8 8', 'M11 7H6v11h11v-5'],
  play: ['M3 7.5a2.5 2.5 0 0 1 2.5-2.5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z', 'M10 9v6l5-3-5-3Z'],
  chat: ['M4 5h16v11h-9l-5 4v-4H4V5Z', 'M8.5 10.5h.01', 'M12 10.5h.01', 'M15.5 10.5h.01'],
}

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
