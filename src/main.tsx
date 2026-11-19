import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/type.css'
import './styles/controls.css'
import './styles/chrome.css'
import './styles/logo.css'
import './styles/art.css'
import './styles/home.css'
import './styles/game.css'
import './styles/hero.css'
import './styles/story.css'
import './styles/parts.css'
import './styles/services.css'
import './styles/pages.css'
import './styles/forms.css'
import './styles/motion.css'
import './styles/showroom.css'
import './styles/follow.css'
import './styles/badge-scene.css'
import './styles/marquee.css'
import './styles/theme.css'
import './styles/studio-services.css'
import './styles/loading.css'
import App from './App.tsx'

/*
 * On the built site, keep a copy of what the visitor opens, so the next visit
 * is instant and the site works offline. See public/sw.js.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
