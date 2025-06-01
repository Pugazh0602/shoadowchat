import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHxJXZncJK4ciLAOPBfOYmsPpMDSIxkts",
  authDomain: "shadowchat-27cc6.firebaseapp.com",
  projectId: "shadowchat-27cc6",
  storageBucket: "shadowchat-27cc6.appspot.com",
  messagingSenderId: "1091478775828",
  appId: "1:1091478775828:web:6a92a4d84ffc33b93f5f01",
  measurementId: "G-B6E5E6Z8WG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 