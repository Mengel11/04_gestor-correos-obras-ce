import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ConfirmarProvider from './context/Confirmar'
import RetroalimentacionProvider from './context/Retroalimentacion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RetroalimentacionProvider>
      <ConfirmarProvider>
        <App />
      </ConfirmarProvider>
    </RetroalimentacionProvider>
  </StrictMode>,
)
