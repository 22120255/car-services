
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getAuth,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDaxfVONMv1dje4-cYY4JiyTIBeoA6ECpo",
    authDomain: "car-service-1b23f.firebaseapp.com",
    projectId: "car-service-1b23f",
    storageBucket: "car-service-1b23f.firebasestorage.app",
    messagingSenderId: "845482919969",
    appId: "1:845482919969:web:c800733711568cdef23b60",
    measurementId: "G-GJ1GP1X8G9"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);