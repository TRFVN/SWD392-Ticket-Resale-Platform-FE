// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAL5BGHU3oIRquBeghPbwQh7oyblhBkxl8",
  authDomain: "tickethub-9f8e9.firebaseapp.com",
  projectId: "tickethub-9f8e9",
  storageBucket: "tickethub-9f8e9.firebasestorage.app",
  messagingSenderId: "799768285377",
  appId: "1:799768285377:web:3a56e8c11c003b2a598440",
  measurementId: "G-LPEM9M8S1R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Hàm tiện ích để log các sự kiện
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

export { app, analytics };
