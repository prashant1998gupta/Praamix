import { Action } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { PageHero } from '../components/PageHero.tsx'
import { Journey, Ways } from '../components/ServicesProcess.tsx'
import { ArtProduction, Engines, GameTypes, Platforms } from '../components/ServicesScope.tsx'
import { Stages } from '../components/Stages.tsx'
import { images } from '../content/images.ts'
import { metaFor } from '../content/routes.ts'
import { pipeline, servicesIntro } from '../content/services.ts'
import { servicesClosing, servicesFaq } from '../content/services-process.ts'
import { briefAction } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function Services() {
  useDocumentMeta(metaFor('/services'))
  const brief = briefAction()

  return (
    <main id="main" tabIndex={-1}>
      <PageHero id="services-title" title={servicesIntro.title} fit={8.8} image={images.worldBuilding}>
        <p className="lede">{servicesIntro.lede}</p>
        <p>{servicesIntro.options}</p>
        <div className="actions">
          <Action to={brief.to} variant="accent" wide>
            {brief.label}
          </Action>
        </div>
      </PageHero>

      <section className="section band" aria-labelledby="pipeline-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="pipeline-title">
              {pipeline.heading}
            </h2>
            <p className="lede">{pipeline.lede}</p>
          </div>
          <Stages />
        </div>
      </section>

      <ArtProduction />
      <Engines />
      <GameTypes />
      <Platforms />
      <Ways />
      <Journey />
      <FaqSection id="faq-title" heading={servicesFaq.heading} items={servicesFaq.items} />
      <Band
        label="Start a project"
        items={[
          {
            title: servicesClosing.title,
            text: servicesClosing.text,
            action: brief.label,
            to: brief.to,
            variant: 'accent',
          },
        ]}
      />
    </main>
  )
}
