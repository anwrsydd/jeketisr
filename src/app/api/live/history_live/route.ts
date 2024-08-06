import { type NextRequest } from "next/server";
import { get_history_live } from "@/lib/utils/get_history_live";

export async function GET(req: NextRequest) {
    if (!req.nextUrl.searchParams.get("start") || !req.nextUrl.searchParams.get("end")) {
        return Response.json(
            {
                error: "parameter required.",
            },
            { status: 400 },
        );
    } else {
        try {
            const start: any = req.nextUrl.searchParams.get("start");
            const end: any = req.nextUrl.searchParams.get("end");
            if (isNaN(start) || isNaN(end))
                return Response.json(
                    {
                        error: "parameters must be numbers.",
                    },
                    { status: 400 },
                );
            const last_live = await get_history_live(Number(start), Number(end));
            return Response.json(last_live, { status: 200 });
        } catch {
            return Response.json(
                {
                    error: "there's something error, please contact the developer.",
                },
                { status: 500 },
            );
        }
    }
}
