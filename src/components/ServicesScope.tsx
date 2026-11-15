import type { CSSProperties } from 'react'
import { SIZES, images } from '../content/images.ts'
import { artProduction } from '../content/services.ts'
import { engines, gameTypes, platforms } from '../content/services-scope.ts'
import { Icon } from './Icon.tsx'
import { Art, Picture } from './Picture.tsx'

/** One prop followed through art production, then the same for characters. */
export function ArtProduction() {
  const image = images.artSequence
  const { character } = artProduction

  return (
    <section className="section" aria-labelledby="art-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="art-title">
            {artProduction.heading}
          </h2>
          <p className="lede">{artProduction.lede}</p>
        </div>
        <figure className="art art--panel sequence" style={{ '--tone': image.tone } as CSSProperties}>
          <div className="art__frame">
            <Picture image={image} sizes={SIZES.wide} />
          </div>
          <ol className="sequence__labels">
            {artProduction.labels.map((label) => (
              <li key={label.text} style={{ '--at': label.at } as CSSProperties}>
                {label.text}
              </li>
            ))}
          </ol>
          <figcaption className="art__caption">{image.caption}</figcaption>
        </figure>
        <div className="split split--flip sequence__more">
          <div className="stack">
            <h3 className="h-sub">{character.heading}</h3>
            {character.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Art image={images.characterStudy} sizes={SIZES.half} />
        </div>
      </div>
    </section>
  )
}

/** Unity and Unreal Engine, side by side and given the same weight. */
export function Engines() {
  return (
    <section className="section band" aria-labelledby="engines-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="engines-title">
            {engines.heading}
          </h2>
          <p className="lede">{engines.lede}</p>
        </div>
        <div className="engines">
          {engines.items.map((engine) => (
            <div className="engine" key={engine.name} data-tilt="">
              <h3 className="engine__name">{engine.name}</h3>
              <p className="engine__path">{engine.path}</p>
              <p>{engine.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The kinds of games taken on, in four groups. */
export function GameTypes() {
  return (
    <section className="section" aria-labelledby="types-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="types-title">
            {gameTypes.heading}
          </h2>
          <p className="lede">{gameTypes.lede}</p>
        </div>
        <ul className="formats">
          {gameTypes.formats.map((format) => (
            <li key={format}>{format}</li>
          ))}
        </ul>
        <div className="quad">
          {gameTypes.groups.map((group) => (
            <div className="quad__item" key={group.title}>
              <h3>{group.title}</h3>
              <ul className="ticks">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The platform categories, each with what it covers. */
export function Platforms() {
  return (
    <section className="section band" aria-labelledby="platforms-title">
      <div className="wrap split split--top">
        <div>
          <div className="section-head">
            <h2 className="h-section" id="platforms-title">
              {platforms.heading}
            </h2>
            <p className="lede">{platforms.lede}</p>
          </div>
          <ul className="platforms">
            {platforms.items.map((platform) => (
              <li className="platform" key={platform.name}>
                <Icon name={platform.icon} />
                <h3 className="platform__name">{platform.name}</h3>
                <p>{platform.detail}</p>
              </li>
            ))}
          </ul>
          <p className="quiet">{platforms.note}</p>
        </div>
        <Art image={images.deviceFamily} sizes={SIZES.half} />
      </div>
    </section>
  )
}
