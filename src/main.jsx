import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScriptProvider } from './context/ScriptContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScriptProvider>
      <App />
    </ScriptProvider>
  </StrictMode>
)
