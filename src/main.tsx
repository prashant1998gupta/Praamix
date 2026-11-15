import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/type.css'
import './styles/controls.css'
import './styles/chrome.css'
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
import './styles/theme.css'
import './styles/studio-services.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
