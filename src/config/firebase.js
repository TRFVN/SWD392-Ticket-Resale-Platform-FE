import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";

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

// Function to set user ID for analytics
export const setAnalyticsUserId = (userId) => {
  if (userId) {
    setUserId(analytics, userId);
  }
};

// Function to set user properties
export const setAnalyticsUserProperties = (properties) => {
  setUserProperties(analytics, properties);
};

// Function to log page views with user context
export const logPageView = (pageName) => {
  logEvent(analytics, "page_view", {
    page_title: pageName,
    page_location: window.location.href,
  });
};

// Function to log user events
export const logUserEvent = (eventName, params = {}) => {
  logEvent(analytics, eventName, params);
};

export default app;
