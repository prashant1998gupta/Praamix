import { Link } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Icon } from '../components/Icon.tsx'
import { GAME_PRIVACY_PATH, metaFor } from '../content/routes.ts'
import { support } from '../content/support.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/**
 * Help for players of Sheriff Town VR: two ways to reach the studio, what to
 * put in a bug report, and answers to common questions. The game's store page
 * links here.
 */
export function Support() {
  useDocumentMeta(metaFor('/support'))
  const { bug } = support

  return (
    <main id="main" tabIndex={-1}>
      <section className="section support" aria-labelledby="support-title">
        <div className="wrap">
          <div className="page-head">
            <p className="eyebrow">{support.eyebrow}</p>
            <h1 className="h-page" id="support-title">
              {support.heading}
            </h1>
            <p className="lede">{support.lede}</p>
          </div>

          <ul className="channels">
            {support.ways.map((way) => (
              <li key={way.name}>
                <a
                  className={`channel channel--${way.icon}`}
                  data-tilt=""
                  href={way.url}
                  {...(way.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="channel__icon">
                    <Icon name={way.icon} />
                  </span>
                  <span className="channel__name">{way.name}</span>
                  <span className="channel__title">{way.title}</span>
                  <span className="channel__text">{way.text}</span>
                  <span className="channel__action">
                    <span>
                      {way.action}
                      {way.external && <span className="visually-hidden"> (opens in a new tab)</span>}
                    </span>
                    <Icon name={way.external ? 'external' : 'mail'} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band" aria-labelledby="bug-title">
        <div className="wrap faq-layout">
          <h2 className="h-section" id="bug-title">
            {bug.heading}
          </h2>
          <div className="stack">
            <p className="lede">{bug.lede}</p>
            <ul className="ticks">
              {bug.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqSection id="support-faq" heading={support.faqHeading} items={support.faq} />

      <section className="section section--ruled">
        <div className="wrap">
          <Link className="link-arrow" to={GAME_PRIVACY_PATH}>
            <span>Sheriff Town VR privacy policy</span>
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}
