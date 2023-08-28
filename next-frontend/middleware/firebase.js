// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCzYDgB7auwOoFoNDFUCZP8s_9KdzHbgtU",
    authDomain: "login-authenticator-c5345.firebaseapp.com",
    projectId: "login-authenticator-c5345",
    storageBucket: "login-authenticator-c5345.appspot.com",
    messagingSenderId: "130745725258",
    appId: "1:130745725258:web:0046a3ab5361a3b08d91b3",
    measurementId: "G-G9WTXVC8YL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);