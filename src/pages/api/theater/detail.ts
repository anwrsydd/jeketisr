import type { NextApiRequest, NextApiResponse } from "next";
import { fetch_premium_live } from "@/lib/utils/showroom";
import { get_theater_schedule, get_members, get_premium_live } from "@/lib/utils/fetch_data";
import { SHOWROOM_API, setlist_image } from "../../../../config/config";

type ShowDetail = {
    image: string;
    room_url: string;
    title: string;
    show_date: number;
    show_date_str: string;
    setlist_name: string;
    member_perform: object[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<API.TheaterDetail>) {
    if (!req.query.id) {
        return res.status(400).json({
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
        });
    } else {
        const { id } = req.query;
        const data = await get_premium_live();
        const dt = await get_theater_schedule();
        const final_data = data.filter((d) => d.paid_live_id === Number(id));
        if (final_data.length < 1) {
            return res.status(404).json({
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
            });
        } else {
            try {
                const theater = dt.filter((d: any) => d.show_date === final_data[0].start_at)[0];
                const member_perform = [];
                const members = await get_members();
                for (let i = 0; i < theater.member_perform.length; i++) {
                    const find_member = members.find((datas) => datas.full_name === theater.member_perform[i]);
                    if (find_member !== undefined) {
                        member_perform.push({
                            ...find_member,
                        });
                    }
                }
                const setlist_img_r = setlist_image.find((objk) =>
                    objk.title.startsWith(final_data[0].title.split(" -")[0]),
                );
                const description = final_data[0].description !== undefined ? final_data[0].description : "";
                const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : final_data[0].image;
                return res.status(200).json({
                    image: final_data[0].image,
                    paid_live_id: final_data[0].paid_live_id,
                    room_url: final_data[0].room_url,
                    title: final_data[0].title,
                    show_date: theater.show_date,
                    setlist_img,
                    description,
                    show_date_str: theater.show_date_str,
                    setlist_name: theater.setlist_name,
                    member_perform,
                    error: false,
                });
            } catch {
                return res.status(500).json({
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
                });
            }
        }
    }
}
