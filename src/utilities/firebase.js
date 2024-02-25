import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, onMessage } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: "AIzaSyB-RY2GoE4rcIYJGgODm_LEjbVDz4yuVio",
  authDomain: "tawk-d13dd.firebaseapp.com",
  projectId: "tawk-d13dd",
  storageBucket: "tawk-d13dd.appspot.com",
  messagingSenderId: "121829267350",
  appId: "1:121829267350:web:fd0811ccb6bb7af95dafb7",
  measurementId: "G-2NKVK56K2N",
  databaseURL: "https://tawk-d13dd-default-rtdb.firebaseio.com"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);
export const messaging = getMessaging(firebaseApp);
