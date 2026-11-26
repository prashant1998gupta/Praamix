/*
 * The 15-day Sheriff Town VR series for the Praamix LinkedIn page: one post a
 * day, 26 November to 10 December 2026, 7:00 PM India time.
 *
 * Every fact comes from src/content/game.ts and src/content/devlog.ts, which
 * were written from the game's own design documents. Every picture is labelled
 * for what it is: key art, an in-game capture or an in-engine render.
 *
 * Rendered by scripts/render-stvr-series.mjs.
 */

export const tags = '#SheriffTownVR #VRGaming #MetaQuest #PCVR #IndieGame #GameDev'

export const days = [
  {
    day: 1,
    date: '2026-11-26',
    kind: 'hero',
    art: 'arrest',
    pos: '50% 92%',
    zoom: 175,
    label: 'Key art',
    eyebrow: 'The motto',
    title: ['Bring them', 'in alive.'],
    hook: 'A police game built around the arrest, not the kill.',
    chips: ['Stun before health', 'Real cuffs', 'Hands up'],
    caption: `Most games that hand you a badge also hand you a body count. Sheriff Town VR goes the other way. 🤠

The statue of the town's first sheriff says it plainly: he brought them in alive. So non-lethal hits drain a person's stun before their health, and when they go down, the job is the arrest. Cuffs that click shut on their wrists, a taser you reload by hand, a baton you flick open.

Killing is never the efficient route here. It's a failure, not a shortcut.

This is day 1 of 15: every day for the next two weeks we'll show you a piece of the game we're building at Praamix. Follow along.

Sheriff Town VR is in development for Meta Quest and PC VR.

${tags} #GameDesign`,
  },
  {
    day: 2,
    date: '2026-11-27',
    kind: 'quote',
    art: 'explosion',
    pos: '50% 92%',
    zoom: 175,
    label: 'Key art',
    eyebrow: 'Overheard in Sheriff Town',
    quote: 'Welcome to Quick Stop! Are you buying, or robbing? Either way, smile for the camera!',
    who: 'Sally, the Quick Stop clerk',
    caption: `"Welcome to Quick Stop! Are you buying, or robbing? Either way, smile for the camera!" 🏪

That's Sally, and she's one of a whole town of people who talk back. A pensioner wants the prices arrested. A skater with no board, a jogger who never stops, a street magician: everybody has a complaint, a scheme or a confession for the Sheriff.

Every story line in Sheriff Town VR is voiced, each character in their own voice. Over 300 of them so far.

Day 2 of 15.

${tags} #VoiceActing #Storytelling`,
  },
  {
    day: 3,
    date: '2026-11-28',
    kind: 'gun',
    gun: 'gravity',
    glow: '#f26b38',
    strip: 'gravity-gun',
    stripPos: '85% 80%',
    label: 'In-engine render · strip: key art',
    eyebrow: 'Tool gun 03 of 14',
    title: ['Gravity', 'Gun'],
    hook: 'Pull it in. Hold it. Punt it down the street.',
    specs: ['Holds anything, whatever it weighs', 'Release to punt along your aim', 'Click the stick for a shockwave'],
    caption: `Meet the Gravity Gun. 🧲

It pulls whatever the beam is on towards you and holds it floating in front of the muzzle, whatever it weighs. Let go of the trigger and it punts what you're holding along your aim. Click the stick and it sends out a shockwave that throws everything nearby outward and up.

It's one of 14 tool guns in Sheriff Town VR, and like all of them it works the same way in your hand: a straight beam shows exactly what you're pointing at, the trigger does the main job, a second button does the second.

Day 3 of 15.

${tags} #Unity #GamePhysics`,
  },
  {
    day: 4,
    date: '2026-11-29',
    kind: 'case',
    shot: 'map-police-station',
    shotLabel: 'In-game capture',
    file: '01',
    title: 'The Great Glazed Heist',
    where: 'Police Station',
    hook: 'The Chief’s box of twelve golden glazed donuts vanished overnight, two days before the bake-off.',
    detail: 'Everybody has a theory. Rico is in Interrogation, because Rico is always in Interrogation.',
    caption: `Case file #01: The Great Glazed Heist. 🍩

The Chief's box of twelve golden glazed donuts vanished overnight, two days before the bake-off. Everybody has a theory. Rico is in Interrogation, because Rico is always in Interrogation.

In Sheriff Town VR, every place has its own people and its own story. You piece it together by walking the streets, knocking on doors and talking to about twenty voiced townspeople, until you find out who has glaze on their whiskers.

Day 4 of 15.

${tags} #Mystery #NarrativeDesign`,
  },
  {
    day: 5,
    date: '2026-11-30',
    kind: 'gun',
    gun: 'portal',
    glow: '#2fc8ff',
    glow2: '#ff9a2e',
    label: 'In-engine render',
    eyebrow: 'Tool gun 05 of 14',
    title: ['Portal', 'Gun'],
    hook: 'Two doors. One space.',
    specs: ['One amber door, one cyan', 'You go through, and so does what you throw', 'Any flat surface'],
    caption: `Two doors, one space. Meet the Portal Gun. 🌀

It places two doors, one amber and one cyan, on any flat surface. Walk through one and you come out of the other, and so does anything you throw.

A design note from the devlog: it won't place a door across an edge, because a door half on a wall sends things into the wall. And portals don't show the view through them, because rendering extra views for every eye is too much to ask of a standalone headset. Good VR is often about what you choose to leave out.

Day 5 of 15.

${tags} #Unity #XR`,
  },
  {
    day: 6,
    date: '2026-12-01',
    kind: 'gun',
    gun: 'ice',
    glow: '#7fe3ff',
    label: 'In-engine render',
    eyebrow: 'Tool gun 06 of 14',
    title: ['Ice', 'Gun'],
    hook: 'Freeze them solid. Then cuff the statue.',
    specs: ['Frost creeps up from the feet', 'Slows, then freezes', 'A statue can be arrested'],
    caption: `The most non-lethal arrest in town. ❄️

The Ice Gun is a frost beam. Hold it on someone and the ice creeps up from their feet and slows them, until they are a statue in a cracked shell for a while.

And a statue can be cuffed. Which makes the Ice Gun a very effective, very non-lethal way to bring someone in alive.

Day 6 of 15.

${tags} #GameDesign #VR`,
  },
  {
    day: 7,
    date: '2026-12-02',
    kind: 'hero',
    art: 'bubbles',
    pos: '50% 92%',
    zoom: 175,
    label: 'Key art',
    eyebrow: 'Tool gun 07 of 14',
    title: ['Bubble', 'Gun'],
    hook: 'Anything it touches floats off in a bubble.',
    chips: ['People', 'Animals', 'Crates', 'Never you'],
    caption: `Anything the Bubble Gun touches floats away. 🫧

A person, an animal, a crate: the bubble swells round it and it floats up, bobbing, until it pops.

One rule we set on purpose: a bubble never closes around you. A bubble around your own head is not a good feeling in VR, so you can pop them, but never ride one. Comfort comes first in a game you wear on your face.

Day 7 of 15.

${tags} #VRDesign #Comfort`,
  },
  {
    day: 8,
    date: '2026-12-03',
    kind: 'case',
    shot: 'map-grocery-store',
    shotLabel: 'In-game capture',
    file: '02',
    title: 'The Big Cheese Heist',
    where: 'Grocery Store',
    hook: 'Big Bertha, a forty-kilo wheel of prize cheddar, is gone from the cold store before the County Cheese Festival.',
    detail: '“She’s not expired. She’s VINTAGE.” – Gloria, the manager',
    caption: `Case file #02: The Big Cheese Heist. 🧀

Big Bertha, a forty-kilo wheel of prize cheddar, is gone from Sheriff Mart's cold store before the County Cheese Festival. Only the manager has the key. The health inspector is visiting today.

Staff and shoppers each saw something, and the crumbs lead somewhere. As Gloria the manager puts it: "She's not expired. She's VINTAGE."

Day 8 of 15.

${tags} #Mystery #NarrativeDesign`,
  },
  {
    day: 9,
    date: '2026-12-04',
    kind: 'hero',
    art: 'builds',
    pos: '50% 92%',
    zoom: 175,
    inset: 'frontier-fort',
    insetLabel: 'In-engine render',
    label: 'Key art',
    eyebrow: 'The workshop',
    title: ['Build it.', 'Then ride it.'],
    hook: 'Snap together a frontier fort, or bolt wheels to a seat and drive away.',
    chips: ['Timber, sandstone, iron', 'Cars from parts', 'Thrusters & balloons'],
    caption: `Build it. Then ride it. 🔧

Snap together a frontier fort from timber, sandstone and iron: foundations, walls, stairs, roofs, gates and jail bars.

Or bolt wheels, a seat and a steering wheel together, sit down, and drive it. Thrusters, propellers, balloons, motors and pistons bolt onto whatever you like and run from remotes, levers and buttons. Save a build as a blueprint and it's still there tomorrow.

Day 9 of 15.

${tags} #Sandbox #GamePhysics`,
  },
  {
    day: 10,
    date: '2026-12-05',
    kind: 'hero',
    art: 'lake',
    pos: '50% 92%',
    zoom: 175,
    label: 'Key art',
    eyebrow: 'Map: Fun Ranch',
    title: ['An island for', 'messing about.'],
    hook: 'Six ziplines, water slides, a midway, a speedway and a human cannon.',
    chips: ['6 ziplines', 'Dunk tank', 'Human cannon'],
    caption: `Not every shift is about crime. 🎢

Fun Ranch is an island built for messing about: a water tower and slides, six ziplines, a midway with a high striker and a dunk tank, a lakeside pier, a farm, a speedway, and a human cannon.

It's one of five sandbox maps in Sheriff Town VR: no clock, no fail state. Wander, talk, experiment.

Day 10 of 15.

${tags} #OpenWorld #Sandbox`,
  },
  {
    day: 11,
    date: '2026-12-06',
    kind: 'hero',
    art: 'bottles',
    pos: '50% 92%',
    zoom: 175,
    inset: 'bottle-trap',
    insetLabel: 'In-game capture',
    label: 'Key art',
    eyebrow: 'Small things we’re proud of',
    title: ['Put a man', 'in a bottle.'],
    hook: 'Uncork it and the nearest person is drawn inside, a hand’s height tall.',
    chips: ['Uncork', 'Capture', 'Cork it'],
    caption: `Small things we're proud of: the containment bottle. 🍾

Uncork it and the nearest person is drawn inside, a hand's height tall. Cork it to keep them.

A few more from the same list: hold a button and the revolver spins around your trigger finger, then lands back in your grip. Jailbreak sends prisoners running for their own hiding places. And slow motion is one button away.

Day 11 of 15.

${tags} #GameDev #Unity`,
  },
  {
    day: 12,
    date: '2026-12-07',
    kind: 'case',
    shot: 'map-rattlesnake-den',
    shotLabel: 'In-game capture',
    file: '03',
    title: 'Big Sal’s Birthday',
    where: 'Rattlesnake Den',
    hook: 'The Rattlesnakes are throwing their boss a fiftieth birthday party, with kidnapped guests.',
    detail: '“You didn’t bring a present, so I’ll assume the present is you leaving.” – Big Sal',
    caption: `Case file #03: Big Sal's Birthday. 🎂

The Rattlesnakes are throwing their boss a fiftieth birthday party, with kidnapped guests. Free the hostages, take your Golden Star from the vault, and arrest the birthday boy.

One of the hostages is a dentist: "They kidnapped me to polish his gold tooth! It's not even gold! It's a painted peanut!"

Day 12 of 15.

${tags} #NarrativeDesign #Storytelling`,
  },
  {
    day: 13,
    date: '2026-12-08',
    kind: 'challenge',
    shot: 'map-colour-bridge',
    shotLabel: 'In-game capture + graphics',
    eyebrow: 'Challenge map',
    title: ['The Colour', 'Bridge'],
    hook: 'A timed crossing of coloured tiles strung between two very tall towers.',
    chips: ['8 tile colours', 'A long way down', 'Beat the clock'],
    caption: `Read the colours. Keep your feet. Beat the clock. ⏱️

The Colour Bridge is a timed crossing of coloured tiles strung between two very tall towers. Eight tile colours, a long way down.

It's one of two challenge maps in Sheriff Town VR: a goal, a clock and a best time to beat. The other is a full bust of the Rattlesnake Den: six gated rooms, waves of gangsters and a timed escape.

Day 13 of 15.

${tags} #VRChallenge #LevelDesign`,
  },
  {
    day: 14,
    date: '2026-12-09',
    kind: 'arsenal',
    label: 'In-engine renders',
    eyebrow: 'The Sheriff’s toolbox',
    title: ['14 tool guns.', 'One way to hold them.'],
    caption: `Fourteen tool guns. One way to hold them. 🧰

Spawn, Physics, Gravity, Portal, Ice, Bubble, Size, Copy-Paste, Food, Scanner, Joint, Harpoon, Connection and Modification.

Every one works the same way in your hand: a straight beam shows exactly what you're pointing at, a small screen on the gun says what mode it's in, and a tool gun only uses the buttons it needs, so you can still walk, turn and jump with one in your hand.

Learn one and you can pick up the next. Read the full breakdown on our devlog: praamix.com/devlog

Day 14 of 15.

${tags} #Unity #GameDesign`,
  },
  {
    day: 15,
    date: '2026-12-10',
    kind: 'hero',
    art: 'chaos',
    pos: '50% 92%',
    zoom: 175,
    label: 'Key art',
    eyebrow: 'Multiplayer: planned',
    title: ['Deputies', 'wanted.'],
    hook: 'Multiplayer is coming to Sheriff Town VR. Join the posse while we build it.',
    chips: ['Discord', 'YouTube', 'praamix.com'],
    caption: `Deputies wanted. ⭐

Multiplayer is coming to Sheriff Town VR. It's planned, not playable yet, and we'll show how it works, and how many sheriffs one town can take, when it's ready.

That's the end of our 15-day tour: arrests not kills, a town that talks back, fourteen tool guns, three case files, a fort, an island and a bridge. Thank you for following along.

Join the posse while we build it:
💬 Discord: discord.gg/YaxSWmB8G6
▶️ Trailer: youtube.com/@SheriffTownVR
🌐 praamix.com/games/sheriff-town-vr

Day 15 of 15.

${tags} #Multiplayer #Community`,
  },
]
