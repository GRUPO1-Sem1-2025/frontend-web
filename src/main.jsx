import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import firebaseConfig from './firebase-config';

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

// Inicializo Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Registro manualmente el Service Worker para FCM
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registrado:', registration);
    })
    .catch(error => {
      console.error('Error al registrar Service Worker:', error);
    });
}

// Escucho mensajes push en primer plano
onMessage(messaging, (payload) => {
  console.log('Mensaje recibido: ', payload);
  const { title, body, icon } = payload.notification;
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon });
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

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
