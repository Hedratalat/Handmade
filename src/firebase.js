// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC479cZqK50E_fkamXwC0rIGGvKU_pnk3g",
  authDomain: "handemade-website.firebaseapp.com",
  projectId: "handemade-website",
  storageBucket: "handemade-website.firebasestorage.app",
  messagingSenderId: "72049561203",
  appId: "1:72049561203:web:06d0254c469da0c594e406",
  measurementId: "G-DW97J36P80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
