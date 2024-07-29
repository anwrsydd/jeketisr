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
            show_date_str: "",
            setlist_name: "",
            member_perform: [],
            error: true,
        };
    } else {
        const ds = await get_theater_schedule();
        const theater = ds.filter((dt: any) => dt.show_date === d.start_at)[0];
        const member_perform = [];
        const members = await get_members();
        for (let i = 0; i < theater?.member_perform.length; i++) {
            const find_member = members.find((datas) => datas.full_name === theater.member_perform[i]);
            if (find_member !== undefined) {
                member_perform.push({
                    ...find_member,
                });
            }
        }
        const setlist_img_r = setlist_image.find((objk) => objk.title.startsWith(d.title.split(" -")[0]));
        const description = d.description !== undefined ? d.description : "";
        const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : d.image;
        return {
            image: d.image,
            paid_live_id: d.paid_live_id,
            room_url: d.room_url,
            title: d.title,
            show_date: theater.show_date,
            setlist_img,
            description,
            show_date_str: theater.show_date_str,
            setlist_name: theater.setlist_name,
            member_perform,
            error: false,
        };
    }
}

export default get_theater_detail;
