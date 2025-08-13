// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrQxHHfwSp4f7Hmdl-Mxq8llzM6kTOXs8",
  authDomain: "react-firebase-a9462.firebaseapp.com",
  projectId: "react-firebase-a9462",
  storageBucket: "react-firebase-a9462.firebasestorage.app",
  messagingSenderId: "563365054037",
  appId: "1:563365054037:web:4efc7ad8461663d582f6dc",
  measurementId: "G-YHEGLHD3Q2"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
export {auth};
