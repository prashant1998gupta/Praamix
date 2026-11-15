import { ContactForm } from '../components/ContactForm.tsx'
import { contact } from '../content/contact.ts'
import { metaFor } from '../content/routes.ts'
import { support } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function Contact() {
  useDocumentMeta(metaFor('/contact'))
  const { aside } = contact

  return (
    <main id="main" className="page" tabIndex={-1}>
      <div className="wrap">
        <header className="page-head">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1 className="h-page">{contact.heading}</h1>
          <p className="lede">{contact.lede}</p>
        </header>
        <div className="contact__layout">
          <ContactForm />
          <aside className="contact__aside" aria-labelledby="aside-title">
            <h2 className="h-sub" id="aside-title">
              {aside.heading}
            </h2>
            <ul className="ticks">
              {aside.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {support.email && (
              <>
                <h2 className="h-sub">{aside.supportHeading}</h2>
                <p>
                  <a href={`mailto:${support.email}`}>{support.email}</a>
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
