import { Action } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Ticker } from '../components/Motion.tsx'
import { Journey, Ways } from '../components/ServicesProcess.tsx'
import { ArtProduction, Engines, GameTypes, Platforms } from '../components/ServicesScope.tsx'
import { PipelineTrack, ServicesHero } from '../components/ServicesShow.tsx'
import { Stages } from '../components/Stages.tsx'
import { metaFor } from '../content/routes.ts'
import { pipeline, servicesIntro } from '../content/services.ts'
import { servicesClosing, servicesFaq } from '../content/services-process.ts'
import { briefAction } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/**
 * Opens on a real asset from our own game, shown at three stages of
 * production. Then the nine stages on a track, the engines, the kinds of game,
 * the platforms, the ways to work together and how a project runs.
 */
export function Services() {
  useDocumentMeta(metaFor('/services'))
  const brief = briefAction()

  return (
    <main id="main" tabIndex={-1}>
      <ServicesHero id="services-title" eyebrow={servicesIntro.eyebrow} title={servicesIntro.title}>
        <p className="svc-hero__lede">{servicesIntro.lede}</p>
        <p className="svc-hero__options">{servicesIntro.options}</p>
        <div className="actions">
          <Action to={brief.to} variant="accent" wide>
            {brief.label}
          </Action>
          <Action to="/services#pipeline" variant="outline" wide>
            {servicesIntro.pipelineAction}
          </Action>
        </div>
      </ServicesHero>
      <Ticker words={servicesIntro.ticker} />

      <section className="section" id="pipeline" aria-labelledby="pipeline-title" tabIndex={-1}>
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="pipeline-title">
              {pipeline.heading}
            </h2>
            <p className="lede">{pipeline.lede}</p>
          </div>
          {/* Wide screens get the track; narrow screens get the same stages as a list that opens. */}
          <div className="pipeline__wide">
            <PipelineTrack />
          </div>
          <div className="pipeline__narrow">
            <Stages />
          </div>
        </div>
      </section>

      <Engines />
      <ArtProduction />
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
