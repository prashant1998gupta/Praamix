import { ContactForm } from '../components/ContactForm.tsx'
import { contact } from '../content/contact.ts'
import { metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

/**
 * A dark opening that says what a brief is and what follows it, then the brief
 * itself with a live summary beside it.
 */
export function Contact() {
  useDocumentMeta(metaFor('/contact'))
  const { next } = contact

  return (
    <main id="main" tabIndex={-1}>
      <header className="contact-hero on-ink">
        <div className="wrap contact-hero__grid">
          <div className="contact-hero__text">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h1 className="h-page">{contact.heading}</h1>
            <p className="lede">{contact.lede}</p>
          </div>
          <ol className="next" aria-label={next.label}>
            {next.steps.map((step, index) => (
              <li className="next__step" key={step.title}>
                <span className="next__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="next__title">{step.title}</span>
                <span className="next__text">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </header>
      <div className="contact-body band">
        <div className="wrap">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
