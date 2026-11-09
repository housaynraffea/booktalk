import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/common/styles/index.css'
import AppRoutes from '@/features/routes/AppRoutes.tsx'
import { SettingsProvider } from './common/context/SettingsContext'
import { AuthProvider } from './common/context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes/>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
