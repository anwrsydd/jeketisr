import type { NextApiRequest, NextApiResponse } from "next";
import { get_history_live } from "@/lib/utils/get_history_live";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { start, end }: any = req.query;
    if (!req.query.start || !req.query.end) {
        return res.status(400).json({
            error: "parameter required.",
        });
    } else {
        try {
            if (isNaN(start) || isNaN(end))
                return res.status(400).json({
                    error: "parameters must be numbers.",
                });
            const last_live = await get_history_live(Number(start), Number(end));
            return res.status(200).json(last_live);
        } catch {
            return res.status(400).json({
                error: "there's something error, please contact the developer.",
            });
        }
    }
}
