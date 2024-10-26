import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAihxC1E9Zv7jY6_3_SY992uCI5xdlaN6U",
  authDomain: "blog-515ce.firebaseapp.com",
  projectId: "blog-515ce",
  storageBucket: "blog-515ce.appspot.com",
  messagingSenderId: "377599169097",
  appId: "1:377599169097:web:e9d4aa9e3aa76a0d3ce598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

export { auth, provider, db}