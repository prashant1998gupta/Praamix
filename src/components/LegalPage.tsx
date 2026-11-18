import { Link } from 'react-router'
import type { LegalBlock, LegalSection } from '../content/legal.ts'
import { business, legalIsDraft } from '../content/site.ts'

/** Writes a YYYY-MM-DD date out in words, e.g. 15 November 2026. */
const inWords = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function Block({ block }: { block: LegalBlock }) {
  if ('p' in block) return <p>{block.p}</p>
  if ('list' in block) {
    return (
      <ul>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <p className="pending">
      <strong>To be confirmed:</strong> {block.pending}
    </p>
  )
}

type Props = {
  title: string
  intro: string
  sections: LegalSection[]
  /** The small line above the title. */
  eyebrow?: string
  /**
   * For a page whose facts are complete: the day it was last changed, as
   * YYYY-MM-DD. It is then shown as final, with no draft notice.
   */
  updated?: string
}

/**
 * The layout both legal pages share: a heading, the draft notice while
 * business details are missing, a list of contents, then the sections.
 */
export function LegalPage({ title, intro, sections, eyebrow = 'Legal', updated }: Props) {
  const draft = !updated && legalIsDraft()
  const effective = business.legalEffectiveDate

  return (
    <main id="main" className="legal" tabIndex={-1}>
      <div className="wrap legal__layout">
        <header className="legal__head">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-page">{title}</h1>
          {draft && (
            <div className="notice" role="note">
              <p className="notice__title">Draft — business details pending review</p>
              <p>
                This is a working draft. The details marked “To be confirmed” are still missing, and
                the text has not had legal review.
              </p>
            </div>
          )}
          {updated ? (
            <dl className="legal__dates">
              <div>
                <dt>Last updated</dt>
                <dd>{inWords(updated)}</dd>
              </div>
            </dl>
          ) : (
            <dl className="legal__dates">
              <div>
                <dt>Draft prepared</dt>
                <dd>{inWords(business.legalDraftDate)}</dd>
              </div>
              <div>
                <dt>Effective date</dt>
                <dd>{effective ? inWords(effective) : 'To be set when the page is published'}</dd>
              </div>
            </dl>
          )}
          <p className="lede">{intro}</p>
        </header>

        <nav className="legal__contents" aria-labelledby="contents-title">
          <h2 className="label" id="contents-title">
            On this page
          </h2>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <Link to={`#${section.id}`}>{section.heading}</Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal__body prose">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              tabIndex={-1}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2 id={`${section.id}-heading`}>{section.heading}</h2>
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
