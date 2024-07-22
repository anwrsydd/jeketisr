import { initializeApp } from "firebase/app";
import {
    getFirestore,
    getDocs,
    collection,
    query,
    where,
    orderBy,
    limit,
} from "firebase/firestore";

const config: Object = {
    apiKey: "AIzaSyDoTkiUdSavOammxE3V1P29OQMXM2DWzU0",
    authDomain: "projek-6531.firebaseapp.com",
    projectId: "projek-6531",
    storageBucket: "projek-6531.appspot.com",
    messagingSenderId: "13844309476",
    appId: "1:13844309476:web:1fc68287d42624ea0ad3f1",
    measurementId: "G-MVND532Q3Y",
};

const fire = initializeApp(config);
const db = getFirestore(fire);

async function getDt() {
    const q = query(
        collection(db, "jkt48_theater_schedule"),
        orderBy("show_date", "desc"),
        limit(1),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
}

export { getDt, db };
