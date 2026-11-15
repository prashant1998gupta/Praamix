import { Band } from '../components/Band.tsx'
import { PeopleProfiles } from '../components/People.tsx'
import { CaptureStrip, Doors } from '../components/StudioShow.tsx'
import { whoWeAre } from '../content/people.ts'
import { metaFor } from '../content/routes.ts'
import { studio } from '../content/studio.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/**
 * Opens on two doors, ours and yours. Then what is on the workbench, the
 * people, how a project moves, and what the first conversation covers.
 */
export function Studio() {
  useDocumentMeta(metaFor('/studio'))
  const { approach, discuss, closing } = studio

  return (
    <main id="main" tabIndex={-1}>
      <Doors />
      <CaptureStrip />

      <section className="section band" id={whoWeAre.id} tabIndex={-1} aria-labelledby="people-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="people-title">
              {whoWeAre.heading}
            </h2>
          </div>
          <PeopleProfiles />
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="approach-title">
              {approach.heading}
            </h2>
            <p className="lede">{approach.lede}</p>
          </div>
          <ol className="journey">
            {approach.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section band" aria-labelledby="discuss-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="discuss-title">
              {discuss.heading}
            </h2>
          </div>
          <ol className="agenda">
            {discuss.items.map((item, index) => (
              <li className="agenda__item" key={item.title} data-tilt="">
                <span className="agenda__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Band
        label="Work with us"
        items={[
          { title: closing.title, text: closing.text, action: 'Explore our services', to: '/services' },
        ]}
      />
    </main>
  )
}
