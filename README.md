# Praamix

Website for Praamix, a studio that makes original games and develops games for clients with Unity and Unreal Engine.

| Page | Address |
| --- | --- |
| Home | `/` |
| Sheriff Town VR | `/games/sheriff-town-vr` |
| Services | `/services` |
| Studio, including Who we are | `/studio` |
| Project brief | `/contact` |
| Terms & Conditions | `/terms-and-conditions` |
| Privacy Policy | `/privacy-policy` |

Built with React, TypeScript and Vite, with hand-written CSS. This repository holds the website only. The game's Unity project lives elsewhere.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:5173/

Needs Node.js 22.18 or newer. The build and the checks run TypeScript files directly, which older versions cannot do.

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally and reloads as you edit |
| `npm run build` | Type-checks, builds `dist/`, and writes an HTML file for every page |
| `npm run preview` | Serves `dist/` at http://localhost:4173/ |
| `npm run lint` | Checks the code for mistakes |
| `npm run check:responsive` | Renders the built site at many screen sizes and exercises the menu, the Dispatch board, the gallery, the form and legal links |
| `npm run media` | Rebuilds the responsive images in `public/media/` from `media-source/` |
| `node scripts/stage-game-art.mjs <exports> <unity project>` | Prepares the Sheriff Town VR pictures in `media-source/game/` from the game's own art exports |

## Edit the content

All words, links and business facts live in `src/content/`. Anything left empty is left off the page, so nothing renders as a dead button or a placeholder.

| File | What it holds |
| --- | --- |
| `site.ts` | Navigation, inquiry destination, support email, social links, legal business facts |
| `game.ts` | Sheriff Town VR copy, facts and store entries |
| `people.ts` | Who we are profiles and portfolio links |
| `home.ts`, `studio.ts`, `services*.ts` | Page copy |
| `contact.ts` | Project brief labels and choices |
| `legal.ts`, `privacy.ts` | Terms & Conditions and Privacy Policy text |

### Switch the project brief on

The contact form is an unconnected draft until `inquiry` in `site.ts` has a destination. Set `endpoint` and `provider` for a form service that accepts a JSON POST, or `email` for a real inbox. Then update the Privacy Policy to name that provider.

### Add a store link

Add an entry to the store list in `game.ts` with the platform, the real store URL, the button wording and its availability. Only real listings belong there.

### Finish the legal pages

Both pages show "Draft — business details pending review" until every business field in `site.ts` is filled and `legalReviewed` is set to `true` after legal review.

## Images

The originals are in `media-source/`. Two kinds:

- **Studio illustrations** in the folder itself. They are generated artwork, not gameplay or client work, and the captions say so.
- **Sheriff Town VR** in `media-source/game/`: in-game captures, the Dispatch board's map pictures, and in-engine renders of in-game models. `scripts/stage-game-art.mjs` prepares them from the game's own art exports. Captures get a gentle sharpen and grade. Renders are lifted off their flat background and set on a studio backdrop. Nothing is repainted, and the captions say what each picture is. The sizes each image is saved at are listed in `scripts/media.config.mjs`. Run `npm run media` after changing either.

## Responsive checks

```
npm run build
npm run check:responsive
```

Results are printed and saved to `.checks/report.txt`, with page sheets in `.checks/screens/`. These are emulated screens in desktop Chrome or Edge, not tests on physical devices.
