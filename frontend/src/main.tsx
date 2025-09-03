import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//mport { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
  
  <App />

     
    
  </StrictMode>
)
