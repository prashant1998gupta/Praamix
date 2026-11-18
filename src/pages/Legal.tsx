import { LegalPage } from '../components/LegalPage.tsx'
import { gamePrivacy, gamePrivacyIntro, gamePrivacySections } from '../content/gamePrivacy.ts'
import { termsIntro, termsSections } from '../content/legal.ts'
import { privacyIntro, privacySections } from '../content/privacy.ts'
import { GAME_PRIVACY_PATH, metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

const TERMS = termsSections()
const PRIVACY = privacySections()
const GAME_PRIVACY = gamePrivacySections()

export function Terms() {
  useDocumentMeta(metaFor('/terms-and-conditions'))
  return <LegalPage title="Terms & Conditions" intro={termsIntro} sections={TERMS} />
}

export function Privacy() {
  useDocumentMeta(metaFor('/privacy-policy'))
  return <LegalPage title="Privacy Policy" intro={privacyIntro} sections={PRIVACY} />
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
