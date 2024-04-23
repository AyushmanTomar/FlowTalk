
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "flowtalk-6e0df.firebaseapp.com",
  projectId: "flowtalk-6e0df",
  storageBucket: "flowtalk-6e0df.appspot.com",
  messagingSenderId: "515620778626",
  appId: "1:515620778626:web:480ffd3e976788f96cfa9b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()