import { home } from '../content/home.ts'
import { SIZES, images } from '../content/images.ts'
import { whoWeAre } from '../content/people.ts'
import { TextLink } from './Action.tsx'
import { Icon } from './Icon.tsx'
import { Lines } from './Lines.tsx'
import { PeopleBrief } from './People.tsx'
import { Art } from './Picture.tsx'

/** One line under the opening that says who Praamix is, with the way to the services. */
export function StudioLine() {
  return (
    <section className="studio-line band" aria-label="About Praamix">
      <div className="wrap studio-line__inner">
        <p>{home.studioLine.text}</p>
        <TextLink to="/services">{home.studioLine.action}</TextLink>
      </div>
    </section>
  )
}

/** The services introduction: what we do for clients, and the four broad steps. */
export function PipelineIntro() {
  const { pipeline } = home

  return (
    <section className="section section--ruled" aria-labelledby="pipeline-title">
      <div className="wrap">
        <div className="split">
          <div className="stack">
            <h2 className="h-section" id="pipeline-title">
              <Lines lines={pipeline.title} />
            </h2>
            <p className="lede">{pipeline.lede}</p>
            <TextLink to="/services">{pipeline.action}</TextLink>
          </div>
          <Art image={images.deviceFamily} sizes={SIZES.half} variant="open" />
        </div>
        <ol className="steps">
          {pipeline.steps.map((step) => (
            <li className="steps__item" key={step.title}>
              <Icon name={step.icon} />
              <div>
                <h3 className="steps__title">{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** A short word about the studio, then the two people behind it. */
export function StudioIntro() {
  return (
    <>
      <section className="section band" aria-labelledby="studio-title">
        <div className="wrap split split--flip">
          <div className="stack">
            <h2 className="h-section" id="studio-title">
              <Lines lines={home.studio.title} />
            </h2>
            {home.studio.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <TextLink to="/studio">{home.studio.action}</TextLink>
          </div>
          <Art image={images.townTree} sizes={SIZES.half} />
        </div>
      </section>
      <section className="section" aria-labelledby="people-title">
        <div className="wrap">
          <div className="section-head section-head--row">
            <h2 className="h-section" id="people-title">
              {whoWeAre.heading}
            </h2>
            <TextLink to={`/studio#${whoWeAre.id}`}>{home.people.action}</TextLink>
          </div>
          <PeopleBrief />
        </div>
      </section>
    </>
  )
}
