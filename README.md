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
| `npm run check:responsive` | Renders the built site at many screen sizes and exercises the menu, the homepage slideshow, the Dispatch board, the galleries, the trailer, the form and legal links |
| `npm run media` | Rebuilds the responsive images in `public/media/` from `media-source/` |
| `node scripts/stage-game-art.mjs <exports> <unity project>` | Prepares the Sheriff Town VR pictures in `media-source/game/` from the game's own art exports |
| `node scripts/stage-game-brand.mjs <posters folder> <logo kit folder>` | Prepares the Sheriff Town VR key-art posters, the logo, its revolver drum and its reveal animation in `media-source/game/`. The animation is made smaller with ffmpeg when it is installed |
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

### The project brief

The contact form's brief is emailed to the studio by a small piece of server code in `worker/`, which Cloudflare runs at `/api/brief`. Nothing else on the site runs on a server. The email is sent through Cloudflare, from `website@praamix.com` to the studio's inbox, and replying to it replies to the visitor.

It needs three things set up once in Cloudflare:

1. **Email Routing switched on** for `praamix.com` (Cloudflare dashboard, the domain, Email). This is also what gives the studio addresses such as `hello@praamix.com`.
2. **The studio's inbox verified** there as a destination address. Cloudflare only lets the site email addresses it has verified.
3. **The secret `BRIEF_TO`** on the `praamix` Worker (Settings, Variables and secrets, type Secret), holding that inbox address. It is a secret so the address is never written in this repository.

Then set `inquiry` in `src/content/site.ts`: `endpoint: '/api/brief'`, `provider: 'Cloudflare'`, and `inbox` to the company whose email the briefs arrive in. Until `endpoint` is set, the form is shown as an unconnected draft and sends nothing.

The server code checks every brief again, accepts posts only from the site's own pages, and quietly drops robots: the form has a hidden field that people never see, and a brief that fills it in, or arrives faster than a person could type, is told "sent" while nothing is sent. `npm run dev` and `npm run preview` run the same code on this machine and print the email in the terminal instead of sending it.

A different form service works too: set `endpoint` to its address and `provider` to its name. Or set `email` to a real inbox, and the form opens the visitor's own email app instead.

### Add a store link

Add an entry to the store list in `game.ts` with the platform, the real store URL, the button wording and its availability. Only real listings belong there.

### Trailer, Discord and YouTube

The game's YouTube channel and Discord server are `channels` in `site.ts`. They feed the footer and the "Join the posse" section. The Discord address must be an invite set to never expire, or the link stops working.

The trailer is `trailer` in `game.ts`: the YouTube video's id, its address and the picture shown before it plays. Nothing is loaded from YouTube until a visitor presses play, and the Privacy Policy says so. If that ever changes, change the policy first.

### Player support

`/support` is the help page for Sheriff Town VR's players, and the support link on the game's Meta Horizon Store page, so that address must not move. Its text is `src/content/support.ts`. The comfort and accessibility settings it names are the game's real ones; if the game's settings change, change that file too.

### The game's privacy policy

Sheriff Town VR has its own privacy policy at `/games/sheriff-town-vr/privacy-policy`, linked from the game's Meta Horizon Store page, so that address must not move. Its text is `src/content/gamePrivacy.ts`, written from what the game's code does: no accounts, no network, no analytics, no microphone, and only settings, favourites, best times and saved builds kept on the headset. If the game ever adds multiplayer, online features, analytics or the Meta Platform SDK, update that file before releasing that version, and change its `updated` date.

### The legal pages

The Terms & Conditions and Privacy Policy are published, with the business facts in `business` in `src/content/site.ts`: Praamix Studio, India, contact `hello@praamix.com`, effective 18 November 2026. The owner approved them for publication; they have not been reviewed by a lawyer, so arrange one before relying on them in a dispute. If any business fact is emptied, or `legalReviewed` is set back to `false`, both pages return to showing "Draft" and leave search results. When the text changes, update `legalEffectiveDate`, which is shown as the "Last updated" date.

## Images

The originals are in `media-source/`. Three kinds:

- **Studio illustrations** in the folder itself. They are generated artwork, not gameplay or client work, and the captions say so.
- **Sheriff Town VR** in `media-source/game/`: in-game captures, the Dispatch board's map pictures, and in-engine renders of in-game models. `scripts/stage-game-art.mjs` prepares them from the game's own art exports. Captures get a gentle sharpen and grade. Renders are lifted off their flat background and set on a studio backdrop. Nothing is repainted, and the captions say what each picture is. The sizes each image is saved at are listed in `scripts/media.config.mjs`. Run `npm run media` after changing either.
- **Sheriff Town VR key art and logo** in `media-source/game/posters/` and `media-source/game/sheriff-town-*`: twelve posters, the logo, and the logo's reveal animation, prepared by `scripts/stage-game-brand.mjs`. The posters are artwork made for the game, not captures from it, and every caption says "Key art".

## Real-time 3D

The showroom on the home and game pages, and the asset at the top of the services page, draw the game's own tool gun models live with three.js. The 3D code loads only when one of those sections is near the screen. Where 3D is not available, a picture of the same model stands in.

The models and textures in `public/models/` are the game's own, and anyone who visits the site can download them. Publish only models you are happy to share: the list is at the top of `scripts/stage-game-models.mjs`.

## The homepage opening

The homepage opens on the in-game picture of the precinct, with the Sheriff Town VR logo and the way in on the left. That part never changes.

The twelve key-art posters, listed in `marquee` in `src/content/game.ts`, are dealt onto it one at a time, like posters thrown down on a desk. Each flies in, lands a little crooked on top of the last, and tilts under the mouse. While posters are out, the precinct behind them goes dark and out of focus. After the last one the pile is swept away and the precinct is clear again. The posters are kept to a card so they do not compete with the logo and the words.

- **The drum is the control.** The round button is the revolver drum from the logo. Pressing it turns it one chamber and deals the next poster, and the ring around it fills as the current one's time runs out. Pressing the top poster does the same. There are also previous and pause buttons, and a swipe works on a phone.
- **It waits when it should.** The show stops while it is off screen, while the pointer or keyboard is on its controls, and when paused. With reduced motion requested it never moves by itself.
- **Posters load as needed.** None is fetched with the page. Each is fetched shortly before its turn.
- **The logo.** The Sheriff Town VR logo is the title here and on the game page. Screen readers and search engines are given the name in text. On a phone the posters land where the logo sits, and each carries the logo, so the site's own steps back while one is out.
- **The logo's reveal.** On wide screens the logo arrives with its own animation, `stv-logo-reveal.webm`: bullets load into the drum and it spins. That file has a see-through background, which Safari and iPhones cannot play, so they get the still logo landing with a spin of its drum. So do phones, slow or metered connections, and reduced motion.

The drum turns because it is a second picture, cut out of the logo and laid back over the same place. Where it sits is `DRUM` in `scripts/stage-game-brand.mjs` and `src/components/GameLogo.tsx`; the two must agree.

## The Praamix logo

The logo is the name with its two A's drawn as two game pieces, one white and one orange: two players, side by side. It is drawn by the site itself, in `src/components/Logo.tsx` and `src/styles/logo.css`. The letters are real text in the site's typeface and the pieces are small drawings sized to match them, so the logo is set by its font size alone and stays sharp at any size.

The logo in the header is alive:

- **Arrival.** When the site opens, the two pieces are set down one after the other.
- **Taking turns.** Every page a visitor opens is a move, and the pieces take turns to jump.
- **They watch the pointer.** The pieces lean a little towards the mouse.
- **The people.** On the studio page each person's profile carries one of the pieces, and pointing at a profile makes that piece jump in the header.
- **A cheat code.** Up, up, down, down, left, right, left, right, B, A.
- **Not found.** On the page for an address that does not exist, one piece has been knocked over.

None of it moves when reduced motion is requested. Wherever the logo appears it is decoration: the link or heading around it carries the name in words.

**Logo files for use elsewhere** are in `brand/`: the logo and the two pieces alone, for dark and for light backgrounds, plus ready-made versions on a background and a profile picture, each as SVG and PNG. The SVGs are pure shapes with no font inside. `node scripts/export-logo.mjs` writes them again.

The same piece is drawn in three other places, which must be kept in step with `Logo.tsx`: `scripts/export-logo.mjs`, the loader in `index.html`, and the browser tab and app icons, made by `node scripts/make-icons.mjs` (also run by `npm run media`). The logo that was first supplied is still in `media-source/praamix-logo.png`.

## Dark throughout

Every page uses the dark theme, the project brief and the legal pages included. The colours are in `src/styles/theme.css`. The switch is kept in `isNight` in `src/content/routes.ts`, with `night` on each page's entry, so a page can be made light again in one place.

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

Nothing needs uploading to a CDN by hand. Everything in `dist/`, the 3D models in `public/models/` included, is served from Cloudflare's network. `public/_headers` tells browsers how long to keep each kind of file, and `wrangler.jsonc` says how addresses map to files, what an unknown address gets, and that addresses under `/api/` run the server code in `worker/`.

The site's address is `site.url` in `src/content/site.ts`. The build uses it for link previews, `sitemap.xml` and `robots.txt`. Once the site is live, put the host's name in `business.hostingProvider` there, because the Privacy Policy names it.

## Slow connections and offline

- **A loader in the page itself.** `index.html` carries a small loader that shows before any code arrives: the Sheriff Town VR logo with its drum spinning, and the Praamix logo under it with its two pieces hopping in turn. It stays hidden for the first third of a second, so a fast load never flashes it. After six seconds it says the connection looks slow. If the code cannot be fetched, it fetches the missing files again straight from the server (the browser may have kept a "not found" from the few seconds while a new version was being published) and reloads once by itself. Only then does it offer to try again. The service worker does the same for code files.
- **Each page's code loads when needed.** A visitor downloads only the page they open. Pointing at or touching a link starts fetching that page early. A page that fails to arrive shows a retry screen, not a blank one.
- **Offline.** On the built site, `public/sw.js` saves the site's core files on the first visit. Pages then open instantly on the next visit and keep working with no connection. It does not run under `npm run dev`. The build stamps it with a new version each time, which replaces what the last build saved.
- **Data saver.** When a device asks to save data, or the connection is very slow, the 3D models are fetched only when the visitor asks for them.
- **Installable.** `public/manifest.webmanifest` and the icons from `npm run media` let the site be installed like an app.

## Motion

Everything that moves is switched off when the visitor's device asks for reduced motion. The page is then still and complete.

On the game page, after the trailer, a scroll scene holds still while the motto is stamped in a word at a time over a sheriff's star, with a poster of the key art flashing up inside it for each word, and the star then opens onto the Chaos poster (`src/components/BadgeScene.tsx`, `src/styles/badge-scene.css`). It is driven by [GSAP](https://gsap.com) and its ScrollTrigger plugin, which are free. They are downloaded only when the scene comes near, never with the opening. With reduced motion, or without scripts, the whole picture and the motto simply show.

## Responsive checks

```
npm run build
npm run check:responsive
```

Results are printed and saved to `.checks/report.txt`, with page sheets in `.checks/screens/`. These are emulated screens in desktop Chrome or Edge, not tests on physical devices.
