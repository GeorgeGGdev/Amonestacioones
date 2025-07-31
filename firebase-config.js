// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVO_Aixzb0R-mdhBBQ3m0WZimH4dCP5Bc",
  authDomain: "amonestaciones-5c481.firebaseapp.com",
  projectId: "amonestaciones-5c481",
  storageBucket: "amonestaciones-5c481.firebasestorage.app",
  messagingSenderId: "747399562651",
  appId: "1:747399562651:web:a2ef0c850fd39e52dacd3e",
  measurementId: "G-268ZC3LC3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Exportar para uso global
window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.serverTimestamp = serverTimestamp;