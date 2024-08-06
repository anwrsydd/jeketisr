import { type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    if (!req.nextUrl.searchParams.get("u")) {
        return Response.json(
            {
                error: "parameter required.",
            },
            { status: 400 },
        );
    } else {
        const u = req.nextUrl.searchParams.get("u");
        const res_r = await fetch("https://www.idn.app/_next/data/2gaZC7BsQkce_fYkSiMjY/" + u + ".json?username=" + u);
        let data = await res_r.json();
        if (!data.pageProps.livestreams) {
            return Response.json(
                {
                    error: "data not found",
                },
                { status: 404 },
            );
        } else {
            return Response.json(
                {
                    result: data.pageProps.livestreams,
                },
                { status: 200 },
            );
        }
    }
}
