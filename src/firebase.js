// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCykG7Qzu7QNiywSxBKnpXOXQXFMgAThO8",
  authDomain: "ilcandellas.firebaseapp.com",
  projectId: "ilcandellas",
  storageBucket: "ilcandellas.firebasestorage.app",
  messagingSenderId: "134652174266",
  appId: "1:134652174266:web:71b42a506df4adaed80783",
  measurementId: "G-Q3V4LQRF2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
