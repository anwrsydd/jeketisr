import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.u) {
        return res.status(400).json({ error: "parameter required." });
    } else {
        const { u } = req.query;
        const res_r = await fetch("https://www.idn.app/_next/data/R8z5FpT2IFCip3pLMjCnr/" + u + ".json?username=" + u);
        let data = await res_r.json();
        if (!data.pageProps.livestreams) {
            return res.status(404).json({ error: "data not found" });
        } else {
            return res.status(200).json({ result: data.pageProps.livestreams });
        }
    }
}
