import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBUerID9lC8v39W8ejsXyxxJhI3fg5l2AM",
  authDomain: "arif-hissab-36b10.firebaseapp.com",
  projectId: "arif-hissab-36b10",
  storageBucket: "arif-hissab-36b10.firebasestorage.app",
  messagingSenderId: "393204981438",
  appId: "1:393204981438:web:7c19078daa4eaf087dc8ef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;