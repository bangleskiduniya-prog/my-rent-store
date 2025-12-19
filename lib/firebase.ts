import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrBBKwp1wTsmxJNdFhOafKpjvXTi0CMao",
  authDomain: "my-rent-store.firebaseapp.com",
  projectId: "my-rent-store",
  storageBucket: "my-rent-store.firebasestorage.app",
  messagingSenderId: "669964569556",
  appId: "1:669964569556:web:57e923d9eab89ef98be441"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };