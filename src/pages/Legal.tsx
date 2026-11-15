import { LegalPage } from '../components/LegalPage.tsx'
import { termsIntro, termsSections } from '../content/legal.ts'
import { privacyIntro, privacySections } from '../content/privacy.ts'
import { metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

const TERMS = termsSections()
const PRIVACY = privacySections()

export function Terms() {
  useDocumentMeta(metaFor('/terms-and-conditions'))
  return <LegalPage title="Terms & Conditions" intro={termsIntro} sections={TERMS} />
}

export function Privacy() {
  useDocumentMeta(metaFor('/privacy-policy'))
  return <LegalPage title="Privacy Policy" intro={privacyIntro} sections={PRIVACY} />
}
