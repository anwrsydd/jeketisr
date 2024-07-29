import axios from "axios";
import cheerio from "cheerio";
import moment from "moment-timezone";
import "moment/locale/id";
import { db } from "../database/firestore";
import { getFirestore, getDocs, getDoc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { get_room_profile } from "./showroom";
import { setlist_image } from "../../../config/config";

async function get_member_detail(r_u_k: string): Promise<JKT48.MemberDetail[]> {
    const q = query(collection(db, "jkt48_members"), where("sr_room_url_key", "==", r_u_k), limit(1));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => {
        return doc.data() as JKT48.MemberDetail;
    });
    return data;
}

async function get_members(): Promise<JKT48.MemberDetail[]> {
    const q = collection(db, "jkt48_members");
    const snapshot = await getDocs(q);
    const data = await snapshot.docs.map((doc) => {
        return doc.data() as JKT48.MemberDetail;
    });
    return data;
}

async function get_member_birthday(): Promise<JKT48.MemberDetail[]> {
    const q = collection(db, "jkt48_members");
    const snapshot = await getDocs(q);
    const data = await snapshot.docs
        .map((doc) => doc.data() as JKT48.MemberDetail)
        .filter(
            (d) =>
                new Date(d.birthday).getMonth() === new Date().getMonth() &&
                (new Date(d.birthday).getDate() > new Date().getDate() ||
                    new Date(d.birthday).getDate() === new Date().getDate()),
        );
    return data;
}

async function get_theater_schedule(): Promise<JKT48.TheaterSchedule[]> {
    const data = await axios.get("https://jkt48.com/theater/schedule?lang=id");
    const $ = cheerio.load(data.data);
    const theater_schedule: JKT48.TheaterSchedule[] = [];
    $("div.entry-mypage > div.entry-mypage__history:nth-child(5) > div.table-responsive > table.table > tbody > tr")
        .get()
        .map(async (o, i) => {
            let d: any = o.children.filter((e) => e.type === "tag");
            let show_date = moment(
                d[0].children[0]?.data + d[0]?.children[2]?.data.replace("Show ", " "),
                "dddd, D.M.YYYY HH:mm",
            ).unix();
            let show_date_str = d[0].children[0].data + d[0].children[2]?.data?.replace("Show ", " ");
            let setlist_name = d[1].children[2].data;
            let member_perform = d[2].children
                .filter((j: { type: string }) => j.type === "tag")
                .map(
                    (l: {
                        children: {
                            data?: any;
                        }[];
                    }) => l.children[0]?.data,
                )
                .filter((k: any) => k !== undefined);
            theater_schedule.push({
                show_date,
                show_date_str,
                setlist_name,
                member_perform,
            });
        });
    return theater_schedule.reverse();
}

async function get_premium_live(): Promise<JKT48.PremiumLive[]> {
    const q = query(collection(db, "jkt48_shows"), orderBy("start_at", "asc"));
    const snapshot = await getDocs(q);
    const data: JKT48.PremiumLive[] = [] as JKT48.PremiumLive[];
    for (let i = 0; i < snapshot.docs.length; i++) {
        const dt = snapshot.docs[i].data();
        const setlist_img_r = setlist_image.find((obj) => obj.title.startsWith(dt.title.split(" -")[0]));
        const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : dt.image;
        const desc_r = await fetch(dt.entrance_url);
        const desc_d = await desc_r.text();
        const description = cheerio
            .load(desc_d)("li.premium-room-content > p.premium-room-telop")
            .text()
            .replace("            ", "")
            .replace("          ", "");
        data.push({
            entrance_url: dt.entrance_url,
            room_url: dt.room_url,
            image: dt.image,
            premium_live_type: dt.premium_live_type,
            is_onlive: dt.is_onlive,
            title: dt.title,
            paid_live_id: dt.paid_live_id,
            room_id: dt.room_id,
            room_name: dt.room_name,
            start_at: dt.start_at,
            setlist_img,
            description,
        });
    }
    return data;
}

async function search_premium_live(id: number): Promise<JKT48.PremiumLive> {
    const q = query(collection(db, "jkt48_shows"), where("paid_live_id", "==", id));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length < 1) {
        return {
            entrance_url: "",
            room_url: "",
            image: "",
            premium_live_type: 0,
            is_onlive: false,
            title: "",
            paid_live_id: 0,
            room_id: 0,
            room_name: "",
            start_at: 0,
            setlist_img: "",
            description: "",
            error: true,
        };
    } else {
        //    const data: JKT48.PremiumLive[] = [] as JKT48.PremiumLive[];
        //    for (let i = 0; i < snapshot.docs.length; i++) {
        const dt = snapshot.docs[0].data();
        const setlist_img_r = setlist_image.find((obj) => obj.title.startsWith(dt.title.split(" -")[0]));
        const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : dt.image;
        const desc_r = await fetch(dt.entrance_url);
        const desc_d = await desc_r.text();
        const description = cheerio
            .load(desc_d)("li.premium-room-content > p.premium-room-telop")
            .text()
            .replace("            ", "")
            .replace("          ", "");
        return {
            entrance_url: dt.entrance_url,
            room_url: dt.room_url,
            image: dt.image,
            premium_live_type: dt.premium_live_type,
            is_onlive: dt.is_onlive,
            title: dt.title,
            paid_live_id: dt.paid_live_id,
            room_id: dt.room_id,
            room_name: dt.room_name,
            start_at: dt.start_at,
            setlist_img,
            description,
        } as JKT48.PremiumLive;
    }
}

export {
    get_member_detail,
    get_members,
    get_member_birthday,
    get_theater_schedule,
    get_premium_live,
    search_premium_live,
};
