import { gamePath, sheriffTownVr } from '../content/game.ts'
import { home } from '../content/home.ts'
import { SIZES, images } from '../content/images.ts'
import { whoWeAre } from '../content/people.ts'
import { Action, TextLink } from './Action.tsx'
import { Chapters } from './Chapters.tsx'
import { Icon } from './Icon.tsx'
import { Lines } from './Lines.tsx'
import { PeopleBrief } from './People.tsx'
import { Art } from './Picture.tsx'

/** Three facts in a strip under the opening. */
export function Facts() {
  return (
    <section className="facts band" aria-label="At a glance">
      <ul className="wrap facts__list">
        {home.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </section>
  )
}

/** The services introduction: what we do for clients, and the four broad steps. */
export function PipelineIntro() {
  const { pipeline } = home

  return (
    <section className="section" aria-labelledby="pipeline-title">
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

/** Sheriff Town VR as one large feature. */
export function FirstGame() {
  const game = sheriffTownVr

  return (
    <section className="section band" aria-labelledby="game-title">
      <div className="wrap">
        <h2 className="h-section" id="game-title">
          {home.game.heading}
        </h2>
        <article className="feature">
          <Art
            className="feature__art"
            image={images.townInHands}
            sizes={SIZES.hero}
            variant="cover"
            caption={false}
          />
          <div className="feature__text">
            <div className="feature__name">
              <h3 className="h-sub">{game.title}</h3>
              <span className="pill">{game.status}</span>
            </div>
            <p className="feature__tagline">
              <Lines lines={game.tagline} />
            </p>
            <p>{game.summary}</p>
            <Action to={gamePath(game)}>{home.game.action}</Action>
            <p className="art__caption">{images.townInHands.caption}</p>
          </div>
        </article>
      </div>
    </section>
  )
}

/** The three chapters about what the game is built around. */
export function Curious() {
  return (
    <section className="section" aria-labelledby="curious-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="curious-title">
            {home.curious.heading}
          </h2>
          <p className="lede">{home.curious.lede}</p>
        </div>
        <Chapters label={home.curious.tabsLabel} chapters={sheriffTownVr.chapters} />
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
