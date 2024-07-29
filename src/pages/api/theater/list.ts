import type { NextApiRequest, NextApiResponse } from "next";
import { get_premium_live } from "@/lib/utils/fetch_data";
import get_theater_detail from "@/lib/theater/detail";

export default async function handler(req: NextApiRequest, res: NextApiResponse<API.TheaterDetail[]>) {
    const d = await get_premium_live();
    const result: API.TheaterDetail[] = [];
    for (let i = 0; i < d.length; i++) {
        const data = await get_theater_detail(d[i].paid_live_id);
        result.push({
            ...data,
        });
    }
    return res.status(200).json(result);
}
