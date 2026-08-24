import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

if (window.location.pathname === '/marilyn-coiffure-maqueta.html') {
  window.history.replaceState(null, '', '/')
}

if (window.location.pathname === '/' && window.location.hash === '#top') {
  window.history.replaceState(null, '', '/')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
