import { TextLink } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { PageHero } from '../components/PageHero.tsx'
import { PeopleProfiles } from '../components/People.tsx'
import { images } from '../content/images.ts'
import { whoWeAre } from '../content/people.ts'
import { metaFor } from '../content/routes.ts'
import { studio } from '../content/studio.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function Studio() {
  useDocumentMeta(metaFor('/studio'))
  const { make, approach, discuss, closing } = studio

  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        id="studio-title"
        eyebrow={studio.eyebrow}
        title={studio.title}
        fit={8}
        image={images.townTree}
        variant="panel"
      >
        <p className="lede">{studio.lede}</p>
      </PageHero>

      <section className="section band" aria-labelledby="make-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="make-title">
              {make.heading}
            </h2>
          </div>
          <div className="duo">
            {make.items.map((item) => (
              <div className="duo__item" key={item.title}>
                <h3 className="h-sub">{item.title}</h3>
                <p>{item.text}</p>
                <TextLink to={item.to}>{item.action}</TextLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id={whoWeAre.id} tabIndex={-1} aria-labelledby="people-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="people-title">
              {whoWeAre.heading}
            </h2>
          </div>
          <PeopleProfiles />
        </div>
      </section>

      <section className="section band" aria-labelledby="approach-title">
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

      <section className="section" aria-labelledby="discuss-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="discuss-title">
              {discuss.heading}
            </h2>
          </div>
          <div className="quad">
            {discuss.items.map((item) => (
              <div className="quad__item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
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
