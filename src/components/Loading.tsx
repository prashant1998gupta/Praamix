import { Component, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/*
 * What a visitor sees while something is on its way, or when it does not
 * arrive: between pages, when a page's code fails to download, and when the
 * connection drops.
 */

/** Shown in place of a page while its code is on the way: a line running along the top. */
export function PageLoading() {
  return (
    <main id="main" className="page-loading" tabIndex={-1} aria-busy="true">
      <div className="page-loading__bar" aria-hidden="true" />
      <p className="visually-hidden" role="status">
        Loading the page…
      </p>
    </main>
  )
}

/** Sits beside the pages. It runs only once a page is really on screen, and then dismisses the opening loader. */
export function PageReady() {
  useEffect(() => {
    window.__bootDone?.()
  }, [])
  return null
}

type BoundaryProps = { children: ReactNode }
type BoundaryState = { failed: boolean }

/**
 * Catches a page that failed to load, most often because the connection
 * dropped while its code was being fetched, and offers to try again instead
 * of leaving a blank screen.
 */
export class PageBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  componentDidCatch() {
    window.__bootDone?.()
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main id="main" className="page" tabIndex={-1}>
        <div className="wrap">
          <div className="page-head" role="alert">
            <p className="eyebrow">Not loaded</p>
            <h1 className="h-page">This page didn’t arrive.</h1>
            <p className="lede">
              Your connection may have dropped while it was loading. Nothing is lost: try again when you are back
              online.
            </p>
            <div className="actions">
              <button className="btn btn--accent" type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

/** A quiet note at the bottom of the screen while the visitor is offline. */
export function NetworkNotice() {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return (
    <p className="network-notice" role="status" data-shown={offline ? '' : undefined}>
      {offline ? 'You are offline. Pages you have already opened still work.' : ''}
    </p>
  )
}
