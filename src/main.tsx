import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/media.css'
import './styles/chrome.css'
import './styles/home.css'
import './styles/feature.css'
import './styles/game.css'
import './styles/game-sections.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
