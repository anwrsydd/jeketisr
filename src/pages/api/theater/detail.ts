import type { NextApiRequest, NextApiResponse } from "next";
import { fetch_premium_live } from "@/lib/utils/showroom";
import { get_theater_schedule, get_members, get_premium_live } from "@/lib/utils/fetch_data";
import { SHOWROOM_API, setlist_image } from "../../../../config/config";
import get_theater_detail from "@/lib/theater/detail";
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
            setlist_name: "",
            member_perform: [],
            error: true,
        });
    } else {
        const { id } = req.query;
        const data: API.TheaterDetail = await get_theater_detail(Number(id));
        if (data.error) {
            return res.status(400).json({
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
            });
        } else {
            return res.status(200).json(data);
        }
    }
}
