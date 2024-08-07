import { Metadata } from "next"
import Image from "next/image";
import moment from "moment-timezone";
import "moment/locale/id";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCalendar,
    faComment,
    faGifts,
    faStopwatch,
    faArrowRight,
    faCakeCandles,
    faClockRotateLeft,
    faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { getDt, db } from "../lib/database/firestore";
import { getFirestore, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { numberWithCommas, count_time } from "../lib/utils/additional";
import { fetch_premium_live, get_room_profile } from "../lib/utils/showroom";
import { get_member_birthday, get_premium_live } from "../lib/utils/fetch_data";
import { get_history_live, get_data_length } from "../lib/utils/get_history_live";
import AOS from "aos";
import TheaterSchedule from "@/components/theater/TheaterSchedule";

moment.tz.setDefault("Asia/Jakarta");

type Data = {
    last_live: JKT48.LastLive[],
    member_birthday: JKT48.MemberDetail[]
}

export const metadata: Metadata = {
    title: "Home | JeketiSR"
}

export const dynamic = "force-dynamic"

export default async function Home() {
    const { last_live, member_birthday }: Data = await getData()
    return (
        <>
            <p>{process.env.TEST}</p>
            <div className="overflow-auto">
                
                <div className="relative flex mb-6">
                <h2 className="font-semibold text-lg absolute left-0">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="mr-1" />
                    Live terakhir
                </h2>
                <Link className="mt-1 absolute right-0 text-sm font-medium hover:underline" href="/history-live">See all history</Link>
                </div>
                <div className="snap-x snap-mandatory flex overflow-x-auto h-auto gap-10 p-4 shadow-inner bg-white/40 rounded-xl">
                    {last_live.map((obj, indx) => (
                        <div
                            className="snap-always snap-center shrink-0 w-60 h-[19rem] shadow-xl bg-gray-200 rounded-xl"
                            key={`live-history-${indx}`}
                        >
                            <Link href={`/live/${obj.d_id}`} title={obj.name}>
                                <div className="relative">
                                    <Image
                                        src={obj.image}
                                        data-aos={indx % 2 === 0 ? "fade-up" : "fade-down"}
                                        className="w-[240px] h-[135px] object-cover shrink-0 rounded-t-lg"
                                        width="240"
                                        height="135"
                                        alt={obj.name}
                                    />
                                    <h3 className="absolute top-1 left-2 bg-gray-300 text-sm rounded-xl px-2">
                                        {obj.type === "SR" ? "SHOWROOM" : "IDN Live"}
                                    </h3>
                                </div>
                                <div className="p-2 px-3">
                                    {obj.status && (
                                        <div className="flex gap-3">
                                            <span className="bg-red-500 w-4 h-4 rounded-full animate-fade mt-0.5"></span>
                                            <p className="text-sm">Now Live!</p>
                                        </div>
                                    )}
                                    <h4 className="text-sm">{obj.name}</h4>
                                    <div className="flex gap-3">
                                        <FontAwesomeIcon icon={faClock} className="mt-2" />
                                        <p className="text-sm mt-1">
                                            {moment(obj.live_at * 1000).format("DD MMMM YYYY HH:mm")}{" "}
                                            {!obj.status
                                                ? "— " + moment(obj.end_at * 1000).format("DD MMMM YYYY HH:mm")
                                                : ""}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-1">
                                        <FontAwesomeIcon icon={faComment} className="mt-0.5" />
                                        <p className="text-sm">{obj.comment} Komentar</p>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <FontAwesomeIcon icon={faGifts} />
                                        <p className="text-sm">{numberWithCommas(obj.paid_gift)} Gold (paid gift)</p>
                                    </div>
                                    {!obj.status && (
                                        <div className="flex gap-3.5 mt-1">
                                            <FontAwesomeIcon icon={faStopwatch} />
                                            <p className="text-sm">{count_time(obj.live_at, obj.end_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                    <div className="snap-always snap-center justify-self-center h-[8rem] hover:text-blue-600">
                        <Link href="/history-live" title="See all history live">
                            <FontAwesomeIcon className="mt-[8rem] text-3xl" icon={faArrowRight} />
                            <p className="text-sm font-semibold">See all history live</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="overflow-auto mt-4">
                <h2 className="font-semibold text-lg">
                    <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                    Jadwal Show (SR Premium Live)
                </h2>
                <TheaterSchedule />
                
            </div>
            <div className="mt-4 md:mx-[2rem]">
                <h2 className="text-base font-semibold text-lg">
                    <FontAwesomeIcon icon={faCakeCandles} className="mr-1" />
                    Next Birthday (bulan ini)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 md:mx-[2rem]">
                    {member_birthday.map((o, i) => {
                        const bd = moment(o.birthday, "D MMMM YYYY").format("D MMMM");
                        return (
                            <Link
                                href={`/member/${o.sr_room_url_key.toLowerCase()}`}
                                title={o.full_name}
                                key={i}
                                className={`h-[8rem] w-[15rem] md:w-[250px] justify-self-left ${i % 2 === 0 ? "justify-self-start" : "justify-self-end"}`}
                            >
                                <div
                                    data-aos={i % 2 === 0 ? "zoom-in-right" : "zoom-in-left"}
                                    data-aos-delay="200"
                                    className={`bg-gray-200 shadow-xl grid grid-rows-2 grid-flow-col h-[8rem] rounded-xl`}
                                >
                                    <div className="row-span-3 flex w-[80px] h-[128px]">
                                        <Image
                                            src={o.image}
                                            width="80"
                                            height="75"
                                            className="justify-y-center object-cover"
                                            alt={o.full_name}
                                        />
                                    </div>
                                    <div className="col-span-2 w-[120px] md:w-[120px]">
                                        <h3 className="text-sm font-medium">{o.full_name.split("/")[0]}</h3>
                                        <div className="flex space-x-1">
                                            <FontAwesomeIcon icon={faCalendar} className="mt-0.5" />
                                            <p className="text-sm font-medium">{bd}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <FontAwesomeIcon icon={faCakeCandles} className="mt-0.5" />
                                            <p className="text-sm font-medium mt-0.5">
                                                Ulang tahun ke-
                                                {moment
                                                    .duration(
                                                        moment(bd + " " + new Date().getFullYear(), "D MMMM YYYY").diff(
                                                            moment(o.birthday, "D MMMM YYYY"),
                                                        ),
                                                    )
                                                    .years()}{" "}
                                                tahun
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

async function getData(): Promise<Data> {
    const data_length = await get_data_length("jkt48_live_history");
    const last_live = await get_history_live(data_length - 10, data_length - (10 - 10));
    let member_birthday = await get_member_birthday();
    return {
        last_live: last_live.reverse(),
        member_birthday,
    };
}
