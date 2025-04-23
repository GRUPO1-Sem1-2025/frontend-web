import React from 'react';
import ReactDOM from 'react-dom/client'; // correcto para React 18+
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Estilos PrimeReact
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </PrimeReactProvider>
    </React.StrictMode>
);