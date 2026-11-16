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
| `npm run check:responsive` | Renders the built site at many screen sizes and exercises the menu, the Dispatch board, the gallery, the trailer, the form and legal links |
| `npm run media` | Rebuilds the responsive images in `public/media/` from `media-source/` |
| `node scripts/stage-game-art.mjs <exports> <unity project>` | Prepares the Sheriff Town VR pictures in `media-source/game/` from the game's own art exports |
| `node scripts/stage-game-models.mjs <unity project>` | Converts the game's tool gun models and textures for the 3D viewer, into `public/models/`. Needs Blender |

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

### Trailer, Discord and YouTube

The game's YouTube channel and Discord server are `channels` in `site.ts`. They feed the footer and the "Join the posse" section. The Discord address must be an invite set to never expire, or the link stops working.

The trailer is `trailer` in `game.ts`: the YouTube video's id, its address and the picture shown before it plays. Nothing is loaded from YouTube until a visitor presses play, and the Privacy Policy says so. If that ever changes, change the policy first.

### Finish the legal pages

Both pages show "Draft — business details pending review" until every business field in `site.ts` is filled and `legalReviewed` is set to `true` after legal review.

## Images

The originals are in `media-source/`. Two kinds:

- **Studio illustrations** in the folder itself. They are generated artwork, not gameplay or client work, and the captions say so.
- **Sheriff Town VR** in `media-source/game/`: in-game captures, the Dispatch board's map pictures, and in-engine renders of in-game models. `scripts/stage-game-art.mjs` prepares them from the game's own art exports. Captures get a gentle sharpen and grade. Renders are lifted off their flat background and set on a studio backdrop. Nothing is repainted, and the captions say what each picture is. The sizes each image is saved at are listed in `scripts/media.config.mjs`. Run `npm run media` after changing either.

## Real-time 3D

The showroom on the home and game pages, and the asset at the top of the services page, draw the game's own tool gun models live with three.js. The 3D code loads only when one of those sections is near the screen. Where 3D is not available, a picture of the same model stands in.

The models and textures in `public/models/` are the game's own, and anyone who visits the site can download them. Publish only models you are happy to share: the list is at the top of `scripts/stage-game-models.mjs`.

## Light and dark

The home, game, services and studio pages are dark. The contact and legal pages are light, for typing and reading. The list is `isNight` in `src/content/routes.ts`, and the colours are in `src/styles/theme.css`. The light logo used on dark pages is made from the supplied logo by `npm run media`: its charcoal is turned white and its orange is left as supplied.

## Hosting

The site is plain files after `npm run build`, so any static host can serve it. It is hosted on **Cloudflare**, which is free, allows business sites and serves from a worldwide network. Vercel's free plan is for non-commercial use only, so it does not fit a studio that sells services.

One deployment serves three things from `dist/`:

| Address | What it is | Where it lives |
| --- | --- | --- |
| `praamix.com` | The studio site | this project |
| `praamix.com/prashant/` | Prashant's portfolio | `public/prashant/` |
| `praamix.com/aman/` | Aman's portfolio | `public/aman/` |

The portfolios are plain folders of their own files. To change one, edit it in its folder here and push.

**How it is deployed.** The Cloudflare project `praamix` is connected to this GitHub repository. Every push to `main` makes Cloudflare run `npm run build` and then `npx wrangler deploy`, which publishes `dist/` as set out in `wrangler.jsonc`. The Node version comes from `.node-version`, the one the build was tested on.

**To connect the domain, once:**

1. In Cloudflare, add `praamix.com` as a domain on the free plan. Cloudflare shows two nameservers.
2. Where the domain was bought, replace its nameservers with those two, and wait for Cloudflare to show the domain as active.
3. In the `praamix` project, open Domains and add `praamix.com` and `www.praamix.com`. HTTPS is set up automatically.

Nothing needs uploading to a CDN by hand. Everything in `dist/`, the 3D models in `public/models/` included, is served from Cloudflare's network. `public/_headers` tells browsers how long to keep each kind of file, and `wrangler.jsonc` says how addresses map to files and what an unknown address gets.

The site's address is `site.url` in `src/content/site.ts`. The build uses it for link previews, `sitemap.xml` and `robots.txt`. Once the site is live, put the host's name in `business.hostingProvider` there, because the Privacy Policy names it.

## Slow connections and offline

- **A loader in the page itself.** `index.html` carries a small loader that shows before any code arrives. It stays hidden for the first third of a second, so a fast load never flashes it. After six seconds it says the connection looks slow, and if the code cannot be fetched it offers to try again.
- **Each page's code loads when needed.** A visitor downloads only the page they open. Pointing at or touching a link starts fetching that page early. A page that fails to arrive shows a retry screen, not a blank one.
- **Offline.** On the built site, `public/sw.js` saves the site's core files on the first visit. Pages then open instantly on the next visit and keep working with no connection. It does not run under `npm run dev`. The build stamps it with a new version each time, which replaces what the last build saved.
- **Data saver.** When a device asks to save data, or the connection is very slow, the 3D models are fetched only when the visitor asks for them.
- **Installable.** `public/manifest.webmanifest` and the icons from `npm run media` let the site be installed like an app.

## Motion

Everything that moves is switched off when the visitor's device asks for reduced motion. The page is then still and complete.

## Responsive checks

```
npm run build
npm run check:responsive
```

Results are printed and saved to `.checks/report.txt`, with page sheets in `.checks/screens/`. These are emulated screens in desktop Chrome or Edge, not tests on physical devices.
