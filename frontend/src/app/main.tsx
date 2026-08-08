import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '../index.css'
import { ThemeProvider } from '../context/ThemeContext'
import { App } from '../App'

// IMPORTANT: this must always be a non-empty, well-formed-looking string.
// Google's own SDK (loaded by GoogleOAuthProvider) throws synchronously
// inside initTokenClient() if client_id is an empty string, which crashes
// the whole React tree (blank white page). A syntactically valid but fake
// placeholder avoids that crash; AuthModal.tsx separately checks the real
// env var (isGoogleConfigured) and blocks the actual sign-in flow with a
// friendly in-app message until a real ID is set, so this placeholder is
// never used to attempt a real Google login.
// Set a real ID in frontend/.env as VITE_GOOGLE_CLIENT_ID to enable
// "Continue with Google" for real.
const googleClientId =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  "000000000000-placeholder-not-configured.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
