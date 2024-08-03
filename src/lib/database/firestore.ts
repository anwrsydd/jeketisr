import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";

const config: Object = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID,
};

const fire = initializeApp(config);
const db = getFirestore(fire);

async function getDt() {
    const q = query(collection(db, "jkt48_theater_schedule"), orderBy("show_date", "desc"), limit(1));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
}

export { getDt, db };
