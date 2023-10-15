// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBPZmWzY5be8-XUiZlJwcZLFXnJXYV0Mqo',
  authDomain: 'agsv-f154d.firebaseapp.com',
  projectId: 'agsv-f154d',
  storageBucket: 'agsv-f154d.appspot.com',
  messagingSenderId: '469144188212',
  appId: '1:469144188212:web:d3d6803554b3b326b1e161',
  measurementId: 'G-X91LWFRSXK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
