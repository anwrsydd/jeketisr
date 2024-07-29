import Image from "next/image";
import Link from "next/link";
import { get_premium_live } from "@/lib/utils/fetch_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import "moment/locale/id";
import ErrorMsg from "@/components/ErrorMsg";

export default function Theater({ shows, error }: { shows: API.TheaterDetail[]; error: boolean }) {
    if (error) return <ErrorMsg />;
    return (
        <div className="mt-2">
            <h2>Jadwal Show (Premium Live)</h2>
            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 place-items-center">
                {shows.map((o: API.TheaterDetail, i: number) => {
                    return (
                        <div
                            className="bg-slate-200 rounded-lg w-[328px] md:min-h-[700px] md:w-[370px]"
                            key={i}
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <Image
                                src={o.setlist_img}
                                alt={o.title}
                                width="370"
                                height="208"
                                className="rounded-t-lg"
                                data-aos="flip-down"
                                data-aos-delay="300"
                            />
                            <div className="p-3">
                                <h3 className="font-medium">{o.title}</h3>
                                <p className="text-sm">{o?.description}</p>
                                <div className="mt-4 border border-0 border-t-2 border-gray-700">
                                    <div className="mt-2 flex space-x-2 text-sm">
                                        <FontAwesomeIcon icon={faCalendar} className="mt-0.5" />
                                        <p>{moment(o.show_date * 1000).format("dddd, DD MMMM YYYY HH:mm")}</p>
                                    </div>
                                    <h4 className="text-base font-medium">Performing members</h4>
                                    <div className="px-1.5 py-3 bg-gray-400/50 snap-x snap-mandatory flex gap-6 overflow-x-auto rounded-md shadow-inner mb-2">
                                        {o.member_perform.length === 0 && (
                                            <p className="text-base">Data belum tersedia untuk saat ini :(</p>
                                        )}
                                        {o.member_perform.map((d: JKT48.MemberDetail, ii: number) => (
                                            <div
                                                className="snap-always shrink-0 snap-align-none"
                                                key={`perform_member_${i}_${ii}`}
                                            >
                                                <Link href={`/member/${d.sr_room_url_key}`} title={d.full_name}>
                                                    <Image
                                                        src={d.image}
                                                        width="50"
                                                        height="50"
                                                        className="rounded-xl"
                                                        alt={d.full_name}
                                                    />
                                                    <h5 className="text-sm">{d.sign_name}</h5>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[4.5rem] mt-4 mb-2 hover:scale-105 transition-all duration-300 w-[4.5rem] p-3 bg-blue-400 rounded-lg">
                                        <Link href={`/theater/${o.paid_live_id}`}>Detail</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any): Promise<Object> {
    try {
        const shows_r = await get_premium_live();
        const shows: JKT48.PremiumLive[] = [];
        console.log(context.req.headers);
        console.log(context.req.headers["x-forwarded-proto"]);
        for (let i = 0; i < shows_r.length; i++) {
            const dt_r = await fetch(
                context.req.headers["x-forwarded-proto"] +
                    "://" +
                    context.req.headers.host +
                    "/api/theater/detail?id=" +
                    shows_r[i].paid_live_id,
            );
            const dt = await dt_r.json();
            shows.push({
                ...dt,
            });
        }
        return {
            props: {
                shows,
                error: false,
            },
        };
    } catch {
        return {
            props: {
                shows: [],
                error: true,
            },
        };
    }
}
