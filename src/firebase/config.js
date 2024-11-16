//* Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

//* Add the Web App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD49Pnx3irtcOBTwEJxZcokSdAXeBIf4xs",
  authDomain: "testcrypto-ae1a1.firebaseapp.com",
  projectId: "testcrypto-ae1a1",
  storageBucket: "testcrypto-ae1a1.firebasestorage.app",
  messagingSenderId: "413851419678",
  appId: "1:413851419678:web:70501a1d248ce14d35da0f",
  measurementId: "G-FXFFGJVFSP",
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
