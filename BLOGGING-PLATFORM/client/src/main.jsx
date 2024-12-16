import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/UserProvider.jsx';

createRoot(document.getElementById('root')).render(
  
    <UserProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </UserProvider>
   
  
)
