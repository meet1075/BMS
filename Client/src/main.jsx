import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AccountProvider from './context/AccountContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AccountProvider>
    <App />
  </AccountProvider>
  </BrowserRouter>,
)
