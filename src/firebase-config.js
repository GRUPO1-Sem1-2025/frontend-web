// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = getMessaging(app);

export { messaging };
export default firebaseConfig;
