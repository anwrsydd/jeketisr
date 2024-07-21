import type { NextApiRequest, NextApiResponse } from "next";
import { fetch_premium_live } from "@/lib/utils/showroom";
import { get_theater_schedule, get_members } from "@/lib/utils/fetch_data";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.id) {
        return res.status(400).json({
            error: "parameter required.",
        });
    } else {
        const { id } = req.query;
        const data = await fetch_premium_live();
        const dt = await get_theater_schedule();
        const final_data = data.filter((d) => d.paid_live_id === Number(id));
        if (final_data.length < 1) {
            return res.status(200).json({
                error: "data not found.",
            });
        } else {
            try {
                const theater = dt.filter((d: any) => d.show_date === final_data[0].start_at)[0];
                const member_perform = [];
                const members = await get_members();
                for (let i = 0; i < theater.member_perform.length; i++) {
                    const find_member = members.find((datas) => datas.full_name === theater.member_perform[i]);
                    //if (find_member !== undefined) {
                    member_perform.push({
                        ...find_member,
                    });
                    //}
                }
                const setlist_img_r = setlist_image.find((objk) =>
                    objk.title.startsWith(final_data[0].title.split(" -")[0]),
                );
                const setlist_img = setlist_img_r !== undefined ? setlist_img_r.url : final_data[0].image;
                return res.status(200).json({
                    image: final_data[0].image,
                    room_url: final_data[0].room_url,
                    title: final_data[0].title,
                    show_date: theater.show_date,
                    setlist_img,
                    show_date_str: theater.show_date_str,
                    setlist_name: theater.setlist_name,
                    member_perform,
                });
            } catch {
                return res.status(500).json({
                    error: "there's something error, please contact the developer.",
                });
            }
        }
    }
}
