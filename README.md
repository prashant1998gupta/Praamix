# Praamix

Website for Praamix, an independent game studio. Two pages:

- `/` the studio homepage
- `/games/sheriff-town-vr` the page for Sheriff Town VR

Built with React, TypeScript and Vite, with hand-written CSS. This repository holds the website only. The game's Unity project lives elsewhere.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:5173/

Needs Node.js 22.18 or newer. The build runs a TypeScript file directly, which older versions cannot do.

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally and reloads as you edit |
| `npm run build` | Type-checks, then writes the finished site to `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173/ |
| `npm run lint` | Checks the code for mistakes |
| `npm run check:responsive` | Renders the built site at many screen sizes and reports problems |
| `npm run media -- <file> <name>` | Prepares a game image for the site |

## Edit the words, links and images

Everything editable is in one file: `src/content/site.ts`.

- **Copy** for both pages, the navigation and the footer.
- **Contact details**: `site.contact.email` and `site.contact.links`.
- **Store links**: `sheriffTownVr.storeLinks`.
- **Images**: `sheriffTownVr.media`.

Anything left empty is left off the page. With no email and no links, the contact section says details are not published yet. With no store links, the store section does not appear. With no gallery images, there is no gallery. Nothing renders as a dead button.

Only add details that are real: real addresses, real store pages, real dates.

## Add game media

Until real captures are added, the image frames show a hatched placeholder labelled "Image pending. Not game footage."

To add a capture:

1. Run the image through the media script. Use a capture at least 2400px wide if you can.

   ```
   npm run media -- "C:\Captures\town-square.png" hero
   ```

   This writes several sizes of the image into `public/media/sheriff-town-vr/`, plus a taller crop for phones, so a phone downloads a small file and a large monitor a sharp one.

2. The script prints an `image: { ... }` entry. Paste it into `src/content/site.ts` in place of `image: null`, and write a real description in `alt`.

There are three places for images, all under `sheriffTownVr.media`:

| Slot | Where it appears |
| --- | --- |
| `feature` | The large image on the homepage |
| `hero` | The main visual at the top of the game page |
| `gallery` | A list of images further down the game page |

For gallery images add `--no-portrait`, since they are shown uncropped.

If a crop cuts off something important, add `focus: '30% 60%'` to the image entry. The two numbers say how far across and how far down the important part is.

## Add another game

Copy the `sheriffTownVr` entry in `src/content/site.ts`, give it a new `slug` and title, and add it to the `games` list. It gets its own page at `/games/<slug>` and a place on the homepage. Titles using letters outside A to Z and 0 to 9 will still fit, with slightly looser sizing.

## Responsive checks

```
npm run build
npm run check:responsive
```

This opens the built site in the Chrome or Edge already installed on the machine and checks both pages for sideways scrolling, clipped headings, small touch targets, tiny text and long lines, across phone, tablet, laptop, desktop and ultrawide sizes. It also covers a phone held sideways, a split-screen window, enlarged text, keyboard, touch, reduced motion, refreshing a page, and font and image loading.

Results are printed and saved to `.checks/report.txt`, with screenshots in `.checks/screens/`. That folder is rebuilt on each run and is not committed.

To run one part only, name it: `npm run check:responsive -- keyboard` or `npm run check:responsive -- fonts image`.

These are emulated screens in a desktop browser. They do not replace opening the site on real phones and tablets, or in Safari and Firefox.

## How it is put together

```
src/content/site.ts     all copy, links and media paths
src/pages/              the two pages and the not-found page
src/components/         masthead wordmark, media frames, header, footer
src/hooks/useWeight.ts  the movement of the featured media
src/styles/             CSS, one file per area; tokens.css holds colour, type and spacing
scripts/                build step, media preparation and the responsive checks
```

The build writes a real HTML file for each page, so opening or refreshing a game page works on any static host without extra server rules.

## Not done yet

The site has not been deployed and no domain is configured.
