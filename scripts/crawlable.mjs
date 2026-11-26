/*
 * The words of each page, as plain HTML, for readers that do not run
 * JavaScript: most AI crawlers (ChatGPT, Claude, Perplexity), link previews,
 * and anyone with scripts off. Without this, those readers saw only "This
 * site needs JavaScript to display".
 *
 * postbuild.mjs puts it inside <div id="root">. The site's code replaces it
 * the moment it starts, so a visitor sees the real page, never this. Every
 * word comes from the same content files the pages use: nothing here is
 * written for crawlers alone.
 */
import { devlog, devlogPath, posts } from '../src/content/devlog.ts'
import { gamePath, sheriffTownVr as game } from '../src/content/game.ts'
import { home } from '../src/content/home.ts'
import { people } from '../src/content/people.ts'
import { GAME_PRIVACY_PATH, PRESS_KIT_PATH } from '../src/content/routes.ts'
import { journey, servicesFaq } from '../src/content/services-process.ts'
import { engines, platforms } from '../src/content/services-scope.ts'
import { servicesIntro, stages } from '../src/content/services.ts'
import { channels, legalNav, nav, site, support as supportContact } from '../src/content/site.ts'
import { studio } from '../src/content/studio.ts'
import { support } from '../src/content/support.ts'

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const p = (text) => `<p>${esc(text)}</p>`
const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
const facts = (items) =>
  `<dl>${items.map((fact) => `<dt>${esc(fact.term)}</dt><dd>${esc(fact.detail)}</dd>`).join('')}</dl>`
const faq = (heading, items) =>
  `<section><h2>${esc(heading)}</h2>${items.map((item) => `<h3>${esc(item.question)}</h3>${p(item.answer)}`).join('')}</section>`
const link = (to, label) => `<a href="${esc(to)}">${esc(label)}</a>`

const menu = () =>
  `<nav aria-label="Primary"><ul>${[{ label: 'Home', to: '/' }, ...nav, { label: 'Devlog', to: '/devlog' }]
    .map((item) => `<li>${link(item.to, item.label)}</li>`)
    .join('')}</ul></nav>`

const footer = () =>
  `<footer>${p(`${site.name}: ${site.description}`)}<ul>${[
    ...legalNav.map((item) => `<li>${link(item.to, item.label)}</li>`),
    `<li>${link(channels.youtube, 'YouTube')}</li>`,
    `<li>${link(channels.discord, 'Discord')}</li>`,
  ].join('')}</ul>${p(`Contact: ${supportContact.email}`)}</footer>`

const gameFacts = () => facts([...game.glance, ...game.confirmed])

const features = () =>
  game.features
    .map(
      (feature) =>
        `<section><h3>${esc(feature.title)}</h3>${feature.body.map(p).join('')}${list(feature.points)}</section>`,
    )
    .join('')

const maps = () =>
  `<section><h2>${esc(game.dispatch.heading)}</h2>${p(game.dispatch.lede)}${game.dispatch.maps
    .map(
      (map) =>
        `<h3>${esc(map.name)}</h3>${p(`${game.dispatch.modes[map.mode].label}${map.story ? ` · ${map.story}` : ''}`)}${p(map.summary)}${list(map.highlights)}`,
    )
    .join('')}</section>`

const stats = () => list(game.stats.map((stat) => `${stat.value}${stat.suffix} ${stat.label}`))

/** The body for one page, by its path. Unknown pages get the title and description only. */
function bodyFor(meta) {
  const intro = `<h1>${esc(meta.title)}</h1>${p(meta.description)}`
  const post = posts.find((item) => devlogPath(item) === meta.path)

  if (meta.path === '/') {
    return `${intro}<section><h2>${esc(game.title)}</h2>${p(game.motto)}${p(game.summary)}${gameFacts()}${stats()}${link(
      gamePath(game),
      `More about ${game.title}`,
    )}</section><section><h2>${esc(home.pillars.heading)}</h2>${game.pillars
      .map((pillar) => `<h3>${esc(pillar.title)}</h3>${p(pillar.text)}`)
      .join('')}</section>${faq(home.faq.heading, home.faq.items)}`
  }

  if (meta.path === gamePath(game)) {
    return `${intro}${p(game.motto)}${p(game.summary)}${gameFacts()}${stats()}<section><h2>What you do in Sheriff Town</h2>${features()}</section>${maps()}<section><h2>${esc(
      game.casesHeading,
    )}</h2>${p(game.casesLede)}${game.cases
      .map((item) => `<h3>${esc(item.title)}</h3>${p(`${item.where}: ${item.hook} ${item.detail}`)}`)
      .join('')}</section>${faq(game.faqHeading, game.faq)}${p(`Press kit: ${PRESS_KIT_PATH}`)}${link(
      PRESS_KIT_PATH,
      'Press kit',
    )}`
  }

  if (meta.path === PRESS_KIT_PATH) {
    return `${intro}${p(game.summary)}${gameFacts()}${stats()}${features()}${p(`Press contact: ${supportContact.email}`)}`
  }

  if (meta.path === '/services') {
    return `${intro}<h2>${esc(servicesIntro.title.join(' '))}</h2>${p(servicesIntro.lede)}${p(servicesIntro.options)}<section><h2>The stages we cover</h2>${stages
      .map((stage) => `<h3>${esc(stage.title)}</h3>${p(stage.summary)}${p(stage.work)}${list(stage.deliverables)}`)
      .join('')}</section><section><h2>${esc(engines.heading)}</h2>${p(engines.lede)}</section><section><h2>${esc(
      platforms.heading,
    )}</h2></section><section><h2>${esc(journey.heading)}</h2>${journey.steps
      .map((step) => `<h3>${esc(step.title)}</h3>${p(step.text)}`)
      .join('')}</section>${faq(servicesFaq.heading, servicesFaq.items)}`
  }

  if (meta.path === '/studio') {
    return `${intro}<h2>${esc(studio.title.join(' '))}</h2>${p(studio.lede)}<section><h2>${esc(studio.make.heading)}</h2>${studio.make.items
      .map((item) => `<h3>${esc(item.title)}</h3>${p(item.text)}`)
      .join('')}</section><section><h2>The people behind Praamix</h2>${people
      .map((person) => `<h3>${esc(person.name)}</h3>${p(`${person.title}. ${person.role}.`)}${p(person.bio)}`)
      .join('')}</section>`
  }

  if (meta.path === '/support') {
    return `${intro}${p(support.lede)}${p(`Email: ${supportContact.email}`)}${faq(support.faqHeading, support.faq)}`
  }

  if (meta.path === devlogPath()) {
    return `${intro}${p(devlog.lede)}${posts
      .map((item) => `<article><h2>${link(devlogPath(item), item.title)}</h2>${p(item.date)}${p(item.description)}</article>`)
      .join('')}`
  }

  if (post) {
    return `<article><h1>${esc(post.title)}</h1>${p(`By ${site.name}, ${post.date}`)}${p(post.intro)}${post.sections
      .map((section) => `<h2>${esc(section.heading)}</h2>${section.paragraphs.map(p).join('')}`)
      .join('')}</article>`
  }

  if (meta.path === GAME_PRIVACY_PATH) return intro
  return intro
}

/** The whole fallback page: menu, the page's words, footer. */
export function crawlableHtml(meta) {
  return `<div class="crawlable">${menu()}<main>${bodyFor(meta)}</main>${footer()}</div>`
}

/*
 * llms.txt: a short, plain guide to the site for AI tools, in the format
 * proposed at llmstxt.org. Facts only, from the same content files.
 */
export function llmsTxt(origin) {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} (${origin}) is an independent game studio in India, run by ${people.map((person) => person.name).join(' and ')}. Its first original game is ${game.title}.`,
    '',
    `## ${game.title}`,
    '',
    game.summary,
    '',
    ...[...game.glance, ...game.confirmed].map((fact) => `- ${fact.term}: ${fact.detail}`),
    ...game.stats.map((stat) => `- ${stat.value}${stat.suffix} ${stat.label}`),
    '',
    '## Pages',
    '',
    `- [${game.title}](${origin}${gamePath(game)}): the game, its maps, tool guns, trailer and FAQ`,
    `- [Press kit](${origin}${PRESS_KIT_PATH}): fact sheet, logo and key art`,
    `- [Devlog](${origin}/devlog): how the game is being made`,
    ...posts.map((post) => `- [${post.title}](${origin}${devlogPath(post)}): ${post.description}`),
    `- [Game development services](${origin}/services): VR, mobile and PC game development with Unity and Unreal Engine`,
    `- [Studio](${origin}/studio): what Praamix makes and the people behind it`,
    `- [Player support](${origin}/support): help with ${game.title}`,
    `- [Contact](${origin}/contact): start a game development project`,
    '',
    '## Elsewhere',
    '',
    `- YouTube: ${channels.youtube}`,
    `- Discord: ${channels.discord}`,
    `- Email: ${supportContact.email}`,
    '',
  ]
  return lines.join('\n')
}
