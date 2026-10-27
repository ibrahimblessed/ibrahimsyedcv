import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config (these values identify the project; they are not secrets.
// Access is controlled by Firebase Auth + the rules in firestore.rules).
const firebaseConfig = {
  apiKey: "AIzaSyDLiM0PiLNHknFf54b8qZt9dV1SLh8E1EA",
  authDomain: "chrisfit-39ec0.firebaseapp.com",
  projectId: "chrisfit-39ec0",
  storageBucket: "chrisfit-39ec0.firebasestorage.app",
  messagingSenderId: "752762262723",
  appId: "1:752762262723:web:3eb6bf61c37d4852323e76",
  measurementId: "G-ZL9JYXXL4R",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics only works in supported browser environments.
isSupported()
  .then((ok) => {
    if (ok) getAnalytics(app);
  })
  .catch(() => {});
