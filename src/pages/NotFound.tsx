import { Action } from '../components/Action.tsx'
import { notFound } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function NotFound() {
  useDocumentMeta(notFound)

  return (
    <main id="main" className="page" tabIndex={-1}>
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">Page not found</p>
          <h1 className="h-page">There’s nothing at this address.</h1>
          <p className="lede">The page may have moved, or the link may be wrong.</p>
          <div className="actions">
            <Action to="/" back>
              Back to Praamix
            </Action>
            <Action to="/services" variant="outline">
              Explore our services
            </Action>
          </div>
        </div>
      </div>
    </main>
  )
}
