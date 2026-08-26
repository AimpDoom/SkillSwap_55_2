import './styles/reset.css'
import './styles/fonts.css'
import './styles/variables.css'
import './styles/global.css'

import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'

export function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
