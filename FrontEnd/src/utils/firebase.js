import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9KIKTCb-Usf-JXRZ35_9QsnOvinDsfUs",
  authDomain: "bunbun-clothing.firebaseapp.com",
  projectId: "bunbun-clothing",
  storageBucket: "bunbun-clothing.firebasestorage.app",
  messagingSenderId: "133115536975",
  appId: "1:133115536975:web:fd6da3965041da407c2c3a",
  measurementId: "G-KQCMD4L5WZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
