import { Link } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { Picture } from '../components/Picture.tsx'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import { images, SIZES } from '../content/images.ts'
import { PRESS_KIT_PATH, metaFor } from '../content/routes.ts'
import { business, channels, site, support } from '../content/site.ts'
import type { SiteImage } from '../content/types.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

const game = sheriffTownVr

/* Every fact here is already stated elsewhere on the site. Nothing about prices or dates until they are real. */
const facts: { term: string; detail: string; url?: string }[] = [
  { term: 'Developer', detail: business.legalName },
  { term: 'Based in', detail: business.address },
  { term: 'Platforms', detail: 'Meta Quest and PC VR' },
  { term: 'Genre', detail: 'VR physics sandbox, with stories and challenges' },
  { term: 'Players', detail: 'Single-player. Multiplayer is planned.' },
  { term: 'Status', detail: game.status },
  { term: 'Release date', detail: 'Not announced' },
  { term: 'Price', detail: 'Not announced' },
  { term: 'Website', detail: `praamix.com${gamePath(game)}`, url: `${site.url}${gamePath(game)}` },
  ...(game.trailer ? [{ term: 'Trailer', detail: 'YouTube', url: game.trailer.url }] : []),
  { term: 'Community', detail: 'Discord', url: channels.discord },
  { term: 'Press contact', detail: support.email, url: `mailto:${support.email}?subject=${encodeURIComponent('Sheriff Town VR press')}` },
]

type Download = { file: string; label: string; detail: string; preview?: SiteImage }

const downloads: Download[] = [
  { file: '/press/sheriff-town-vr-logo.png', label: 'Sheriff Town VR logo', detail: 'PNG, see-through background, 1200 × 900', preview: images.stvLogo },
  { file: '/press/sheriff-town-vr-key-art-arrest.jpg', label: 'Key art · Arrest', detail: 'JPG, 1920 × 1080', preview: images.posterArrest },
  { file: '/press/sheriff-town-vr-key-art-chaos.jpg', label: 'Key art · Chaos', detail: 'JPG, 1920 × 1080', preview: images.posterChaos },
  { file: '/press/sheriff-town-vr-key-art-bubbles.jpg', label: 'Key art · Bubbles', detail: 'JPG, 1920 × 1080', preview: images.posterBubbles },
  { file: '/press/sheriff-town-vr-key-art-gravity-gun.jpg', label: 'Key art · Gravity Gun', detail: 'JPG, 1920 × 1080', preview: images.posterGravityGun },
  { file: '/press/sheriff-town-vr-key-art-explosion.jpg', label: 'Key art · Explosion', detail: 'JPG, 1920 × 1080', preview: images.posterExplosion },
  { file: '/press/sheriff-town-vr-key-art-party.jpg', label: 'Key art · Party', detail: 'JPG, 1920 × 1080', preview: images.posterParty },
  { file: '/press/sheriff-town-vr-capture-precinct.jpg', label: 'In-game capture · The precinct', detail: 'JPG, 1440 × 900', preview: images.stvDistrict },
  { file: '/press/praamix-logo-for-dark-backgrounds.png', label: 'Praamix logo, for dark backgrounds', detail: 'PNG, 2400 × 401' },
  { file: '/press/praamix-logo-for-light-backgrounds.png', label: 'Praamix logo, for light backgrounds', detail: 'PNG, 2400 × 401' },
]

/**
 * The press kit for Sheriff Town VR: the facts, a description, the features,
 * and the logo and key art to download. For journalists, streamers and video
 * makers covering the game.
 */
export function PressKit() {
  useDocumentMeta(metaFor(PRESS_KIT_PATH))

  return (
    <main id="main" tabIndex={-1}>
      <section className="section" aria-labelledby="press-title">
        <div className="wrap">
          <div className="page-head">
            <p className="eyebrow">Press kit</p>
            <h1 className="h-page" id="press-title">
              {game.title}, for press and creators.
            </h1>
            <p className="lede">
              The facts, the story and the art for writing about {game.title} or making a video of it. For anything
              else, such as a preview build or an interview, write to {support.email}.
            </p>
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="facts-title">
        <div className="wrap faq-layout">
          <h2 className="h-section" id="facts-title">
            Fact sheet.
          </h2>
          <dl className="facts-list">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="label">{fact.term}</dt>
                <dd>
                  {fact.url ? (
                    <a href={fact.url} {...(fact.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {fact.detail}
                    </a>
                  ) : (
                    fact.detail
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="about-title">
        <div className="wrap faq-layout">
          <h2 className="h-section" id="about-title">
            About the game.
          </h2>
          <div className="stack">
            <p className="lede">{game.summary}</p>
            <ul className="press__features">
              {game.pillars.map((pillar) => (
                <li key={pillar.id}>
                  <h3 className="h-sub">{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </li>
              ))}
            </ul>
            <ul className="ticks">
              {game.stats.map((stat) => (
                <li key={stat.label}>
                  {stat.value}
                  {stat.suffix} {stat.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="downloads-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="downloads-title">
              Logos and art.
            </h2>
            <p className="lede">Full-size files. Key art is artwork made for the game, not in-game captures.</p>
          </div>
          <ul className="press__grid">
            {downloads.map((item) => (
              <li key={item.file}>
                <a className="press__file" href={item.file} download>
                  <span
                    className={item.file.includes('light-backgrounds') ? 'press__preview press__preview--light' : 'press__preview'}
                    aria-hidden="true"
                  >
                    {item.preview ? (
                      <Picture image={{ ...item.preview, alt: '' }} sizes={SIZES.card} />
                    ) : (
                      <img src={item.file} alt="" loading="lazy" />
                    )}
                  </span>
                  <span className="press__label">{item.label}</span>
                  <span className="press__detail">
                    {item.detail} · Download
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="wrap">
          <Link className="link-arrow" to={gamePath(game)}>
            <span>See the {game.title} page</span>
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}
