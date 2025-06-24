// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBGUpVBiw49aMkjZH5v6kwXWlr0MoD3qB0",
  authDomain: "tecnobus-1f39b.firebaseapp.com",
  projectId: "tecnobus-1f39b",
  storageBucket: "tecnobus-1f39b.firebasestorage.app",
  messagingSenderId: "806322581567",
  appId: "1:806322581567:web:ef58cfb969636087ab888a",
  measurementId: "G-QFLPRQ9PGJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, ...options } = payload.notification;
  self.registration.showNotification(title, options);
});
