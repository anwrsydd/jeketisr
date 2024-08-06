import { type NextRequest } from "next/server"
import { get_members } from "@/lib/utils/fetch_data";

type Response = {
    status: number;
    error: boolean;
    result: JKT48.MemberDetail[] | string[];
};

export async function GET(req: NextRequest) {
    if (!req.nextUrl.searchParams.get("type"))
        return Response.json({ status: 400, error: true, result: [] }, { status: 400 });
    const dt = await get_members();
    if (req.nextUrl.searchParams.get("type") === "string") {
        return Response.json({ status: 200, error: false, result: dt.map((n) => n.full_name) }, { status: 200 });
    } else if (req.nextUrl.searchParams.get("type") === "data") {
        return Response.json({ status: 200, error: false, result: dt }, { status: 200 });
    } else {
        return Response.json({ status: 400, error: true, result: [] }, { status: 400 });
    }
}
