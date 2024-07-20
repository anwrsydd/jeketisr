import axios from "axios";
import { SHOWROOM_API, setlist_image } from "../../../config/config";

async function fetch_premium_live(): Promise<JKT48.PremiumLive[]> {
    const res = await fetch(SHOWROOM_API + "/premium_live/search?page=1&count=10&is_pickup=0");
    const request = await res.json();
    const data_r = request.result.filter((e: { room_id: number }) => e.room_id === 332503);
    const data = [];
    for (let i = 0; i < data_r.length; i++) {
        const setlist_img_r = setlist_image.find((obj) => obj.title.startsWith(data_r[i].title.split(" -")[0]));
        const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : data_r[i].image;
        data.push({ ...data_r[i], setlist_img });
    }
    return data;
}

async function get_room_profile(room_id: number | string): Promise<SR.SHOWROOMProfile> {
    const request = await fetch(SHOWROOM_API + "/room/profile?room_id=" + room_id);
    const data = await request.json();
    return data;
}

export { fetch_premium_live, get_room_profile };
