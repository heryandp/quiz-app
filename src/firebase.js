// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import untuk Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Import untuk Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkTXKWvCSzJTwxqFyPOO2PLVCUJ3n0MBE",
  authDomain: "quiz-e586a.firebaseapp.com",
  databaseURL: "https://quiz-e586a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-e586a",
  storageBucket: "quiz-e586a.appspot.com",
  messagingSenderId: "110820887590",
  appId: "1:110820887590:web:56ebb7632ae3121996eae7",
  measurementId: "G-PPKRH0FT1H"
};

// Inisialisasi Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Inisialisasi Firebase database
const database = getDatabase(firebaseApp);

// Inisialisasi Firebase Authentication
const auth = getAuth(firebaseApp);

// Inisialisasi Firestore
const firestore = getFirestore(firebaseApp);

export { database, auth, firestore };