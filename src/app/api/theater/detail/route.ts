import { type NextRequest } from "next/server";
import { fetch_premium_live } from "@/lib/utils/showroom";
import { get_theater_schedule, get_members, get_premium_live } from "@/lib/utils/fetch_data";
import { SHOWROOM_API, setlist_image } from "@/../config/config";
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

export async function GET(req: NextRequest) {
    if (!req.nextUrl.searchParams.get("id")) {
        return Response.json({
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
        const id = req.nextUrl.searchParams.get("id");
        const data: API.TheaterDetail = await get_theater_detail(Number(id));
        if (data.error) {
            return Response.json({
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
            return Response.json(data);
        }
    }
}
