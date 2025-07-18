// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwX_0LV0ZWCweTsVyaUCCePr6Bsbrgy44",
  authDomain: "curebay-21207.firebaseapp.com",
  projectId: "curebay-21207",
  storageBucket: "curebay-21207.firebasestorage.app",
  messagingSenderId: "931248115707",
  appId: "1:931248115707:web:60ae6e04a374c9e585455e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth }; 