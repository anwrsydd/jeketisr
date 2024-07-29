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
} from "@fortawesome/free-solid-svg-icons";
import { getDt, db } from "../lib/database/firestore";
import { useEffect, useState } from "react";
import { getFirestore, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { numberWithCommas, count_time } from "../lib/utils/additional";
import { fetch_premium_live, get_room_profile } from "../lib/utils/showroom";
import { get_member_birthday, get_premium_live } from "../lib/utils/fetch_data";
import { get_history_live, get_data_length } from "../lib/utils/get_history_live";
import AOS from "aos";

moment.tz.setDefault("Asia/Jakarta");

export default function Home({
    last_live,
    member_birthday,
}: {
    last_live: JKT48.LastLive[];
    member_birthday: JKT48.MemberDetail[];
}) {
    const [showlist, setShowList] = useState<any>([]);
    useEffect(() => {
        fetch("/api/theater/list")
            .then((res) => res.json())
            .then((d) => setShowList(d));
    });
    return (
        <>
            <div className="overflow-auto">
                <h2 className="font-semibold">Live terakhir</h2>
                <div className="snap-x snap-mandatory flex overflow-x-auto h-auto gap-14 p-4 shadow-inner bg-white/40 rounded-xl">
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
                    <div className="snap-always snap-center justify-self-center h-[8rem] hover:scale-110 duration-300 transition-all">
                        <Link href="/history-live" title="See all history live">
                            <FontAwesomeIcon className="mt-[8rem] text-3xl" icon={faArrowRight} />
                            <p className="text-sm font-semibold">See all history live</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="overflow-auto mt-4">
                <h2 className="font-semibold">Jadwal SHOW (SR Premium Live)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 h-auto gap-4">
                    {showlist.map((o: API.TheaterDetail, i: number) => (
                        <div
                            className="bg-slate-200 shadow-xl rounded-lg w-[328px] min-h-[646px] md:min-h-[700px] md:w-[370px] justify-self-center"
                            key={`theater-${i}`}
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
                    ))}
                </div>
            </div>
            <div className="mt-4 md:mx-[2rem]">
                <h2 className="text-base font-semibold">Next Birthday (bulan ini)</h2>
                <div className="grid grid-cols-1 gap-1 md:mx-[2rem]">
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

export async function getServerSideProps(context: any): Promise<Object> {
    const data_length = await get_data_length("jkt48_live_history");
    const last_live = await get_history_live(data_length - 10, data_length - (10 - 10));
    let member_birthday = await get_member_birthday();
    return {
        props: {
            last_live: last_live.reverse(),
            member_birthday,
        },
    };
}
