import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "resume-analyzer-e6040.firebaseapp.com",
  projectId: "resume-analyzer-e6040",
  storageBucket: "resume-analyzer-e6040.firebasestorage.app",
  messagingSenderId: "842186449541",
  appId: "1:842186449541:web:cef8e5d338fd562ac17fec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };