import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import {
    faClock,
    faCalendar,
    faComment,
    faGifts,
    faStopwatch,
    faArrowRight,
    faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";
import { get_member_detail } from "../../lib/utils/fetch_data";
import { get_room_profile } from "../../lib/utils/showroom";
import { get_member_live } from "@/lib/utils/get_history_live";
import { numberWithCommas, count_time } from "../../lib/utils/additional";
import moment from "moment-timezone";
import "moment/locale/id";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorMsg from "@/components/ErrorMsg";

export default function Member({
    detail,
    sr_room_profile,
    history_live,
    error,
}: {
    detail: JKT48.MemberDetail;
    sr_room_profile: SR.SHOWROOMProfile;
    history_live: JKT48.LastLive[];
    error: boolean;
}) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState(null);
    if (error) {
        return (
            <div className="mt-8">
                <p className="text-xl font-semibold justify-self-center">404 Not Found</p>
                <p className="text-lg justify-self-center">Halaman yang kamu cari tidak ditemukan.</p>
                <Link href="/" className="justify-self-center">
                    <p className="text-blue-600">Back to homepage</p>
                </Link>
            </div>
        );
    }
    const member_photo: string = sr_room_profile.image_square;
    return (
        <>
            <div className="m-3 md:mx-[8rem] bg-gray-100/50 rounded-xl p-2">
                <div className="border-b-2 border-gray-500 p-3 grid grid-cols-1">
                    <Image
                        data-aos="zoom-in-up"
                        data-aos-delay="200"
                        src={detail.image}
                        width="128"
                        height="181"
                        className="rounded-xl border border-slate-400 justify-self-center"
                        alt={detail.full_name}
                    />
                    <h1 className="text-base justify-self-center font-medium">{detail.full_name.split("/")[0]}</h1>
                    <div className="min-w-full mt-2 pb-2">
                        <div className="grid grid-cols-2">
                            <div className="text-left">
                                <p className="font-semibold">Name</p>
                            </div>
                            <div className="text-left">
                                <p className="font-normal">{detail.full_name.split(" /")[0]}</p>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Birthday</p>
                            </div>
                            <div className="text-left">
                                <p className="font-normal">{detail.birthday}</p>
                            </div>
                            <div className="text-left flex space-x-1">
                                <FontAwesomeIcon icon={faInstagram} className="mt-1" />
                                <p className="font-semibold">Instagram</p>
                            </div>
                            <div className="text-left">
                                <Link
                                    href={
                                        detail.instagram.startsWith("http") || detail.instagram.startsWith("www")
                                            ? detail.twitter
                                            : `https://instagram.com/${detail.instagram}`
                                    }
                                >
                                    <p className="font-normal text-gray-700">
                                        {detail.instagram.startsWith("http")
                                            ? detail.instagram.split("com/")[1].split("/")[0]
                                            : detail.instagram}
                                    </p>
                                </Link>
                            </div>
                            <div className="text-left flex space-x-1">
                                <FontAwesomeIcon icon={faXTwitter} className="mt-1" />
                                <p className="font-semibold">Twitter (X)</p>
                            </div>
                            <div className="text-left">
                                <Link
                                    href={
                                        detail.twitter.startsWith("http") || detail.twitter.startsWith("www")
                                            ? detail.twitter
                                            : `https://x.com/${detail.twitter}`
                                    }
                                >
                                    <p className="font-normal text-gray-700">
                                        {detail.twitter.startsWith("http")
                                            ? detail.twitter.split("com/")[1].split("/")[0]
                                            : detail.twitter}
                                    </p>
                                </Link>
                            </div>
                            <div className="text-left flex space-x-1">
                                <Image
                                    src="/showroom_icon.png"
                                    width="26"
                                    height="26"
                                    className="rounded-lg"
                                    alt="SHOWROOM"
                                />
                                <p className="font-semibold">SHOWROOM</p>
                            </div>
                            <div className="text-left">
                                <Link href={`https://www.showroom.com/room/profile?room_id=${sr_room_profile}`}>
                                    <p className="font-normal text-blue-600">Here</p>
                                </Link>
                            </div>
                            <div className="text-left flex space-x-1">
                                <Image src="/idn_icon.png" width="26" height="26" className="rounded-lg" alt="IDN" />
                                <p className="font-semibold">IDN Live</p>
                            </div>
                            <div className="text-left">
                                <Link href={detail.idn_url}>
                                    <p className="font-normal text-blue-600">Here</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-3 md:mx-[4rem]">
                <h1 className="text-base font-semibold">Live terakhir</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {history_live.map((obj, indx) => (
                        <div
                            className={`shrink-0 w-[15rem] h-[20rem] shadow-xl bg-gray-200 rounded-xl ${indx % 2 === 0 ? "justify-self-start" : "justify-self-end"} md:justify-self-center`}
                            key={indx}
                            data-aos={indx % 2 === 0 ? "fade-down-left" : "fade-up-right"}
                        >
                            <Link href={`/live/${obj.d_id}`}>
                                <div className="relative">
                                    <Image
                                        src={obj.image}
                                        data-aos={indx % 2 === 0 ? "fade-up" : "fade-down"}
                                        data-aos-delay="300"
                                        className="w-[240px] h-[160px] object-cover shrink-0"
                                        width="320"
                                        height="160"
                                        alt={obj.name}
                                    />
                                    <p className="absolute top-1 left-2 bg-gray-300 text-sm rounded-xl px-2">
                                        {obj.type === "SR" ? "SHOWROOM" : "IDN Live"}
                                    </p>
                                </div>
                                <div className="p-2 px-3">
                                    {obj.status && (
                                        <div className="flex gap-3">
                                            <span className="bg-red-500 w-4 h-4 rounded-full animate-fade mt-0.5"></span>
                                            <p className="text-sm">Now Live!</p>
                                        </div>
                                    )}
                                    <h1 className="text-sm">{obj.name}</h1>
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
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    try {
        const query: string[] = context.params.id.toLowerCase().split("_");
        const query_extract: string =
            query[0].toUpperCase() + "_" + (query[1].charAt(0).toUpperCase() + query[1].slice(1));
        const detail: JKT48.MemberDetail[] = await get_member_detail(
            query[1] === "olinem" ? "JKT48_OlineM" : query_extract,
        );
        const sr_room_profile = await get_room_profile(detail[0].sr_room_id);
        const history_live = await get_member_live(query[1].charAt(0).toUpperCase() + query[1].slice(1));
        return {
            props: {
                detail: detail[0],
                sr_room_profile,
                history_live,
                error: false,
            },
        };
    } catch {
        return {
            props: {
                detail: {},
                sr_room_profile: {},
                history_live: [],
                error: true,
            },
        };
    }
}
