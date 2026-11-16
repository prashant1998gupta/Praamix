import { Action } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Community, TrailerButton, TrailerSection } from '../components/GameFollow.tsx'
import { DispatchBoard, Overheard, Pillars } from '../components/GameShowcase.tsx'
import { ComingNext, Kinetic } from '../components/GameStory.tsx'
import { Marquee } from '../components/Marquee.tsx'
import { PipelineIntro, StudioIntro, StudioLine } from '../components/HomeSections.tsx'
import { Stats, Ticker } from '../components/Motion.tsx'
import { Showroom } from '../components/Showroom.tsx'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import { home } from '../content/home.ts'
import { metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/**
 * The studio's own game comes first: its pictures and logo in the opening, what
 * you do in it, the town's voices and its maps. Then the studio and the people, then client services.
 */
export function Home() {
  useDocumentMeta(metaFor('/'))
  const { hero, closing } = home
  const game = gamePath(sheriffTownVr)

  return (
    <main id="main" tabIndex={-1}>
      <Marquee id="hero-title" eyebrow={hero.eyebrow} title={sheriffTownVr.title}>
        <p className="showcase__motto">{sheriffTownVr.motto}</p>
        <p className="showcase__lede">{sheriffTownVr.summary}</p>
        <div className="actions">
          <Action to={game} variant="accent" wide>
            {hero.playerAction}
          </Action>
          <Action to="/#maps" variant="light" wide>
            {hero.mapsAction}
          </Action>
        </div>
        {sheriffTownVr.trailer && <TrailerButton trailer={sheriffTownVr.trailer} />}
      </Marquee>
      <Ticker words={sheriffTownVr.ticker} />
      <Stats items={sheriffTownVr.stats} label="Sheriff Town VR in numbers" />
      {sheriffTownVr.trailer && <TrailerSection trailer={sheriffTownVr.trailer} />}
      <StudioLine />
      <Pillars heading={home.pillars.heading} action={home.pillars.action} />
      <Kinetic text={sheriffTownVr.motto} />
      <Showroom {...sheriffTownVr.showroom} />
      <ComingNext />
      <DispatchBoard band />
      <Overheard />
      <Community />
      <StudioIntro />
      <PipelineIntro />
      <FaqSection id="faq-title" heading={home.faq.heading} items={home.faq.items} band />
      <Band
        label="Where to go next"
        items={[
          {
            title: closing.player.title,
            text: closing.player.text,
            action: closing.player.action,
            to: game,
          },
          {
            title: closing.client.title,
            text: closing.client.text,
            action: home.pipeline.action,
            to: '/services',
          },
        ]}
      />
    </main>
  )
}
