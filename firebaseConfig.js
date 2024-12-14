// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
/*import { getAnalytics } from "firebase/analytics";*/
import { getAuth } from "firebase/auth";
/*import { getDatabase } from "firebase/database";*/
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEJ3n9dmaPWS3puNxvYI-1LRAZ4SMl19Y",
  authDomain: "callmemaybe-ae909.firebaseapp.com",
  projectId: "callmemaybe-ae909",
  storageBucket: "callmemaybe-ae909.firebasestorage.app",
  messagingSenderId: "756881188199",
  appId: "1:756881188199:web:962e39648c4714846e3bc2",
  measurementId: "G-KNX3H1VQJJ",
  /*databaseURL: "https://callmemaybe-ae909-default-rtdb.firebaseio.com/",*/
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/*const analytics = getAnalytics(app);*/
const auth = getAuth(app);
/*const db = getDatabase(app);*/
const db = getFirestore(app);

export { auth, db };