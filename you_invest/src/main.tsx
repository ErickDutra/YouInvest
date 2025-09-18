import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppBar from './components/AppBar'
import './styles/All.css'
import MonitorPage from './pages/MonitorPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <AppBar />
    <MonitorPage/>
  </StrictMode>
)
