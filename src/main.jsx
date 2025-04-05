import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Register from './Autenticacion/Register.jsx';
import { AuthProvider } from './context/AuthProvider';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <App />
</AuthProvider>,
)
