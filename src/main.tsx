import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'
import { LOCAL_STORAGE_KEYS } from './shared/lib/constants'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme {
  try {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)

    return storedTheme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const initialTheme = getStoredTheme()

document.body.setAttribute('data-theme', initialTheme)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"> exists in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
