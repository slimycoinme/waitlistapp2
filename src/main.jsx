import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Validate environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

console.log('Checking environment variables...');
const missingEnvVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: Missing environment variables: ${missingEnvVars.join(', ')}</div>`;
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  // Set up auth persistence
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set to local');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error initializing Firebase: ${error.message}</div>`;
  throw error;
}

const auth = getAuth(app);

// Add error handler for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.email);
    // Store user info in localStorage for persistence
    localStorage.setItem('user', JSON.stringify({
      email: user.email,
      displayName: user.displayName,
      uid: user.uid
    }));
  } else {
    console.log('User is signed out');
    localStorage.removeItem('user');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});

// Check if root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: Root element not found</div>`;
  throw new Error('Root element not found');
}

// Create React root and render app
try {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('Rendering app...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error rendering app: ${error.message}</div>`;
  throw error;
}
