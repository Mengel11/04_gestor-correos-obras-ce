import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/Auth'
import ConfirmarProvider from './context/Confirmar'
import RetroalimentacionProvider from './context/Retroalimentacion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RetroalimentacionProvider>
      <AuthProvider>
        <ConfirmarProvider>
          <App />
        </ConfirmarProvider>
      </AuthProvider>
    </RetroalimentacionProvider>
  </StrictMode>,
)
