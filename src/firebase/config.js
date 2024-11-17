//* Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

//* Add the Web App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT99Y-F796JFIPKOdeGboN_VMinY-6rQc",
  authDomain: "task-coin-7d8fe.firebaseapp.com",
  projectId: "task-coin-7d8fe",
  storageBucket: "task-coin-7d8fe.firebasestorage.app",
  messagingSenderId: "743633334962",
  appId: "1:743633334962:web:9bd5c3a9b6c53586b2cfab",
  measurementId: "G-W3Q20HSFYJ",
};

//* Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//* Initialize Firebase Auth and set persistence
const auth = getAuth(firebase_app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Failed to set session persistence:", error);
  });

export { auth };
export default firebase_app; 
