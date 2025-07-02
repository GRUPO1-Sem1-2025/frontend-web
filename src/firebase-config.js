// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGUpVBiw49aMkjZH5v6kwXWlr0MoD3qB0",
  authDomain: "tecnobus-1f39b.firebaseapp.com",
  projectId: "tecnobus-1f39b",
  storageBucket: "tecnobus-1f39b.appspot.com",
  messagingSenderId: "806322581567",
  appId: "1:806322581567:web:ef58cfb969636087ab888a",
  measurementId: "G-QFLPRQ9PGJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = getMessaging(app);

export { messaging };
export default firebaseConfig;
