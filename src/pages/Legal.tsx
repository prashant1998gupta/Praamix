import { LegalPage } from '../components/LegalPage.tsx'
import { gamePrivacy, gamePrivacyIntro, gamePrivacySections } from '../content/gamePrivacy.ts'
import { termsIntro, termsSections } from '../content/legal.ts'
import { privacyIntro, privacySections } from '../content/privacy.ts'
import { GAME_PRIVACY_PATH, metaFor } from '../content/routes.ts'
import { business, legalIsDraft } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/* Once the pages are approved, they show the day they took effect. Until then, the draft notice and dates. */
const published = () => (legalIsDraft() ? undefined : business.legalEffectiveDate)

const TERMS = termsSections()
const PRIVACY = privacySections()
const GAME_PRIVACY = gamePrivacySections()

export function Terms() {
  useDocumentMeta(metaFor('/terms-and-conditions'))
  return <LegalPage title="Terms & Conditions" intro={termsIntro} sections={TERMS} updated={published()} />
}

export function Privacy() {
  useDocumentMeta(metaFor('/privacy-policy'))
  return <LegalPage title="Privacy Policy" intro={privacyIntro} sections={PRIVACY} updated={published()} />
}

/** The privacy policy for the game itself, linked from its store page. */
export function GamePrivacy() {
  useDocumentMeta(metaFor(GAME_PRIVACY_PATH))
  return (
    <LegalPage
      eyebrow={gamePrivacy.game}
      title="Privacy Policy"
      intro={gamePrivacyIntro}
      sections={GAME_PRIVACY}
      updated={gamePrivacy.updated}
    />
  )
}
