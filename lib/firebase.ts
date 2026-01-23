import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SƏNİN_API_KEY",
  authDomain: "SƏNİN_DOMAIN",
  projectId: "SƏNİN_PROJECT_ID",
  storageBucket: "SƏNİN_BUCKET",
  messagingSenderId: "SƏNİN_SENDER_ID",
  appId: "SƏNİN_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Rekordu bazaya yazmaq
export const rekordYaz = async (ad: string, xal: number) => {
  if (!ad || xal <= 0) return;
  await addDoc(collection(db, "liderler"), {
    ad,
    xal,
    tarix: new Date()
  });
};
