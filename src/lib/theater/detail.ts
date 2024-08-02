import { get_theater_schedule, get_members, search_premium_live } from "@/lib/utils/fetch_data";
import { setlist_image } from "@/../config/config";

async function get_theater_detail(id: number): Promise<API.TheaterDetail> {
    const d = await search_premium_live(id);
    if (d?.error) {
        return {
            image: "",
            paid_live_id: 0,
            room_url: "",
            title: "",
            show_date: 0,
            setlist_img: "",
            description: "",
            setlist_name: "",
            member_perform: [],
            error: true,
        };
    } else {
        const description = d.description !== undefined ? d.description : "";
        return {
            image: d.image,
            paid_live_id: d.paid_live_id,
            room_url: d.room_url,
            title: d.title,
            show_date: d.start_at,
            setlist_img: d.setlist_img,
            description,
            setlist_name: d.title,
            member_perform: d.member_perform,
            error: false,
        };
    }
}

export default get_theater_detail;
