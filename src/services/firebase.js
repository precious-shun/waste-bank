// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
<<<<<<< HEAD
import { getAnalytics } from "firebase/analytics";
=======
// import { getAnalytics } from "firebase/analytics";
>>>>>>> waste-prices
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAnGiKkPBWGE9YGdn9siF0m-Jc9oblLzY",
  authDomain: "waste-bank-67563.firebaseapp.com",
  projectId: "waste-bank-67563",
  storageBucket: "waste-bank-67563.firebasestorage.app",
  messagingSenderId: "659924022906",
  appId: "1:659924022906:web:3aac89828be914e7c46dc3",
  measurementId: "G-3VB5WPR2EW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
<<<<<<< HEAD
const analytics = getAnalytics(app);
=======
// const analytics = getAnalytics(app);
>>>>>>> waste-prices

export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------------------------------------------------------------------------------------------

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyB_jU02pSwSIJ6bq94UCujndHNR-HrKNXA",
//   authDomain: "auth-f1971.firebaseapp.com",
//   projectId: "auth-f1971",
//   storageBucket: "auth-f1971.firebasestorage.app",
//   messagingSenderId: "225683927197",
//   appId: "1:225683927197:web:6cfdc4a9b0d9fb11e6a474",
//   measurementId: "G-KR535WFDB0",
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
<<<<<<< HEAD
// export const db = getFirestore(app);
=======
// export const db = getFirestore(app);
>>>>>>> waste-prices
