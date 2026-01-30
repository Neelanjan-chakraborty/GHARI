import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Config extracted from your google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyBuAUOWo-ZvyowiSf1Uh2X2YBOrKQSX5HI",
    authDomain: "ghari-5b9bb.firebaseapp.com",
    projectId: "ghari-5b9bb",
    storageBucket: "ghari-5b9bb.firebasestorage.app",
    messagingSenderId: "399403302252",
    appId: "1:399403302252:android:1832486fca8058f8e6c749"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export default app;
