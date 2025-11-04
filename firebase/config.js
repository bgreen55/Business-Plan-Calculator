
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJbbvCjdueCeuTGW224t72o5qAM_SizZI",
  authDomain: "bpc-calculator-f17ce.firebaseapp.com",
  projectId: "bpc-calculator-f17ce",
  storageBucket: "bpc-calculator-f17ce.firebasestorage.app",
  messagingSenderId: "75715878223",
  appId: "1:75715878223:web:ec378fdc96cb753022793a",
  measurementId: "G-BEWCZ1JDXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
