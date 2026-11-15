import { Action } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Curious, Facts, FirstGame, PipelineIntro, StudioIntro } from '../components/HomeSections.tsx'
import { PageHero } from '../components/PageHero.tsx'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import { home } from '../content/home.ts'
import { images } from '../content/images.ts'
import { metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function Home() {
  useDocumentMeta(metaFor('/'))
  const { hero, closing } = home
  const game = gamePath(sheriffTownVr)

  return (
    <main id="main" tabIndex={-1}>
      <PageHero id="hero-title" eyebrow={hero.eyebrow} title={hero.title} image={images.worldBuilding}>
        <p className="lede">{hero.lede}</p>
        <p className="hero__audiences">{hero.audiences}</p>
        <div className="actions">
          <Action to={game} wide>
            {hero.playerAction}
          </Action>
          <Action to="/services" variant="outline" wide>
            {hero.clientAction}
          </Action>
        </div>
      </PageHero>
      <Facts />
      <PipelineIntro />
      <FirstGame />
      <Curious />
      <StudioIntro />
      <FaqSection id="faq-title" heading={home.faq.heading} items={home.faq.items} band />
      <Band
        label="Where to go next"
        items={[
          {
            title: closing.client.title,
            text: closing.client.text,
            action: home.pipeline.action,
            to: '/services',
          },
          {
            title: closing.player.title,
            text: closing.player.text,
            action: closing.player.action,
            to: game,
          },
        ]}
      />
    </main>
  )
}
