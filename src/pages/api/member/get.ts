import type { NextApiRequest, NextApiResponse } from "next";
import { get_members } from "@/lib/utils/fetch_data";

type Response = {
    status: number;
    error: boolean;
    result: JKT48.MemberDetail[] | string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (!req.query.type) return res.status(400).json({ status: 400, error: true, result: [] });
    const dt = await get_members();
    if (req.query.type === "string") {
        return res.status(200).json({ status: 200, error: false, result: dt.map((n) => n.full_name) });
    } else if (req.query.type === "data") {
        return res.status(200).json({ status: 200, error: false, result: dt });
    } else {
        return res.status(400).json({ status: 400, error: true, result: [] });
    }
}
