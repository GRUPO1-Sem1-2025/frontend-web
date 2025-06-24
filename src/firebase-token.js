import { messaging } from './firebase-config'; // Ajusta la ruta a tu firebase-config.js
import { getToken } from 'firebase/messaging';

const VAPID_KEY = 'BHpjwtaKwEL3LAzYITZlSbfrbo9-cBojgR-0kVp2Vl4K3G_QCcEME2iteCyGmj3rd6OHxEHfQa6b7_c9sn1Uy_Y';

export async function solicitarPermisoYObtenerToken() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    throw new Error('El navegador no soporta notificaciones push');
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Permiso de notificaciones denegado');
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error('No se obtuvo el token FCM');
  }

  return token;
}
