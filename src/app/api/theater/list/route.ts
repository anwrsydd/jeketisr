import { get_premium_live } from "@/lib/utils/fetch_data";
import get_theater_detail from "@/lib/theater/detail";

export const dynamic = "force-dynamic";

export async function GET() {
    const d = await get_premium_live();
    const result: API.TheaterDetail[] = [];
    for (let i = 0; i < d.length; i++) {
        const data = await get_theater_detail(d[i].paid_live_id);
        result.push({
            ...data,
        });
    }
    return Response.json(result);
}
