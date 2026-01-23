import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SƏNİN_API_KEY",
  authDomain: "SƏNİN_DOMAIN",
  projectId: "SƏNİN_PROJECT_ID",
  storageBucket: "SƏNİN_BUCKET",
  messagingSenderId: "SƏNİN_SENDER_ID",
  appId: "SƏNİN_APP_ID"
};

// Bu hissə Vercel-də "Firebase App already exists" xətasının qarşısını alır
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export const rekordYaz = async (ad: string, xal: number, rejim: string) => {
  try {
    if (!ad || xal < 0) return;
    await addDoc(collection(db, "liderler"), {
      ad,
      xal,
      rejim,
      tarix: new Date()
    });
  } catch (error) {
    console.error("Firebase xətası:", error);
  }
};
