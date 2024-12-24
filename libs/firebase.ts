// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9pjjkul4P85TEB2ltS62z4zZO5jjjNMo",
  authDomain: "proje-8c0aa.firebaseapp.com",
  projectId: "proje-8c0aa",
  storageBucket: "proje-8c0aa.firebasestorage.app",
  messagingSenderId: "442917384987",
  appId: "1:442917384987:web:99514bf8fd3127bea199be",
  measurementId: "G-NCJX410DE9"
};

let firebaseApp;

// Tarayıcı ortamında Firebase'i başlat
if (typeof window !== "undefined") {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // Analytics'i yalnızca tarayıcıda başlat
  if ("measurementId" in firebaseConfig) {
    getAnalytics(firebaseApp);
  }
}

export default firebaseApp;