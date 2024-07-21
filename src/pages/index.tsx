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
import { get_member_birthday } from "../lib/utils/fetch_data";
import { get_history_live } from "../lib/utils/get_history_live";
import AOS from "aos";

moment.tz.setDefault("Asia/Jakarta");

export default function Home({
    show_schedule,
    last_live,
    member_birthday,
}: {
    show_schedule: JKT48.PremiumLive[];
    last_live: JKT48.LastLive[];
    member_birthday: JKT48.MemberDetail[];
}) {
    function toURL(url: string): void {
        window.location.href = url;
    }
    return (
        <>
            <div className="overflow-auto">
                <h2 className="font-semibold">Live terakhir</h2>
                <div className="snap-x snap-mandatory flex overflow-x-auto h-[21rem] gap-14 p-4 shadow-inner bg-white/40 rounded-xl">
                    {last_live.map((obj, indx) => (
                        <div
                            className="snap-always snap-center shrink-0 w-60 h-[19rem] shadow-xl bg-gray-200 rounded-xl"
                            key={`live-history-${indx}`}
                        >
                            <Link href={`/live/${obj.d_id}`}>
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
                    <div className="snap-always snap-center justify-self-center h-[18rem] hover:scale-110 duration-300 transition-all">
                        <Link href="/history-live">
                            <FontAwesomeIcon className="mt-[8rem] text-3xl" icon={faArrowRight} />
                            <p className="text-sm font-semibold">See all history live</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="overflow-auto mt-4">
                <h2 className="font-semibold">Jadwal SHOW (SR Premium Live)</h2>
                <div className="snap-x snap-mandatory flex overflow-x-auto h-[20rem] gap-14 p-4 shadow-inner bg-white/40 rounded-xl">
                    {show_schedule.map((o, i) => (
                        <div
                            className="snap-always snap-center shrink-0 w-60 h-[18rem] shadow-xl bg-gray-200 rounded-xl hover:scale-105 duration-500"
                            key={i}
                        >
                            <Link href={`/theater/${o.paid_live_id}`}>
                                <Image
                                    src={o.setlist_img}
                                    className="object-cover shrink-0 w-[240px] h-[135px] rounded-t-lg"
                                    width="240"
                                    height="135"
                                    data-aos={i % 2 === 0 ? "fade-up" : "fade-down"}
                                    alt={o.title}
                                />
                                <div className="p-2 px-3">
                                    <h3 className="text-sm font-semibold mb-2">{o.title}</h3>
                                    {o.is_onlive && (
                                        <div className="flex gap-3">
                                            <span className="bg-red-500 w-4 h-4 rounded-full animate-fade mt-0.5"></span>
                                            <p className="text-sm">Now Live!</p>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <FontAwesomeIcon icon={faClock} className="mt-0.5" />
                                        <p className="text-sm">
                                            {moment(o.start_at * 1000).format("dddd, DD MMMM YYYY HH:mm")}
                                        </p>
                                    </div>
                                    <div className="flex gap-3"></div>
                                </div>
                            </Link>
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

export async function getServerSideProps(): Promise<Object> {
    const show_schedule = await fetch_premium_live();
    const last_live = await get_history_live(0, 5);
    let member_birthday = await get_member_birthday();
    return {
        props: {
            show_schedule,
            last_live,
            member_birthday,
        },
    };
}
