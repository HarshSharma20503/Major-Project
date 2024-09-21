// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Messaging, getMessaging } from "firebase/messaging";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./service-account.json" assert { type: "json" };
import admin from "firebase-admin";
import { assert } from "console";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export { admin, messaging, app };
