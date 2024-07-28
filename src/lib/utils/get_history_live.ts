import { db } from "../database/firestore";
import {
    getFirestore,
    getDocs,
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    endAt,
    getCountFromServer,
} from "firebase/firestore";

async function get_history_live(
    start: number,
    end: number,
): Promise<JKT48.LastLive[]> {
    const q = query(
        collection(db, "jkt48_live_history"),
        orderBy("d_id"),
        startAfter(start),
        endAt(end),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data() as JKT48.LastLive);
    return data;
}

async function get_member_live(sign_name: string): Promise<JKT48.LastLive[]> {
    const name = sign_name;
    const end = name.replace(/.$/, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 1),
    );
    const q = query(
        collection(db, "jkt48_live_history"),
        where("name", ">=", name),
        where("name", "<", end),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs
        .map((doc) => doc.data() as JKT48.LastLive)
        .sort((a, b) => b.live_at - a.live_at);
    return data;
}

async function get_live_detail(id: number): Promise<JKT48.LastLive[]> {
    const q = query(
        collection(db, "jkt48_live_history"),
        where("d_id", "==", id),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data() as JKT48.LastLive);
    return data;
}

async function get_data_length(collection_name: string): Promise<number> {
    const data = await getCountFromServer(collection(db, collection_name));
    return data.data().count;
}

export { get_history_live, get_member_live, get_live_detail, get_data_length };
