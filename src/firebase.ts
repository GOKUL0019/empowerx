// src/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB67Q18pUCz8NcdpWUp9GvZuOOicxvZxEE',
  authDomain: 'y2prove-auth.firebaseapp.com',
  projectId: 'y2prove-auth',
  storageBucket: 'y2prove-auth.appspot.com',
  messagingSenderId: '54605986830',
  appId: '1:54605986830:web:ed31c1967fdb09ae25d05f',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
