import Image from "next/image";
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
import { fetch_premium_live } from "@/lib/utils/showroom";
import { get_theater_schedule, get_members } from "@/lib/utils/fetch_data";
import moment from "moment-timezone";
import "moment/locale/id";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ErrorMsg from "@/components/ErrorMsg";

export default function TheaterDetail() {
    const router = useRouter();
    const id = router.query.id;
    const [detail, setDetail] = useState<any>();
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    useEffect(() => {
        fetch("/api/theater/detail?id=" + id)
            .then((res) => res.json())
            .then((dt) => {
                try {
                    if (dt.error) {
                        setIsError(true);
                    } else {
                        setDetail(dt);
                        setIsLoad(false);
                    }
                } catch {
                    setIsError(true);
                }
            });
    }, [id]);
    if (isError) return <ErrorMsg />;
    if (isLoad) return <p>Loading...</p>;
    return (
        <>
            <div className="m-3 md:grid md:grid-rows-2 md:grid-flow-col">
                <div className="md:row-span-3 md:h-[45rem] md:grid md:content-center">
                    <Image
                        src={detail.setlist_img}
                        width="337"
                        height="139"
                        alt={detail.title}
                        className="rounded-xl mb-2 shadow-xl"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    />
                    {detail.is_onlive && (
                        <div className="flex gap-2">
                            <span className="bg-red-500 w-4 h-4 rounded-full animate-fade mt-0.5"></span>
                            <p className="text-sm">Now Live!</p>
                        </div>
                    )}
                    <h1 className="font-bold text-lg">{detail.title}</h1>
                    <div className="flex space-x-1">
                        <FontAwesomeIcon icon={faCalendar} className="mt-0.5" />
                        <p className="font-medium text-sm">
                            {moment(detail.show_date * 1000).format("dddd, DD MMMM YYYY HH:mm")}
                        </p>
                    </div>
                    <div className="flex space-x-1 mt-2">
                        <Image src="/showroom_icon.png" width="26" height="26" className="rounded-lg" alt="SHOWROOM" />
                        <Link href={detail.room_url}>
                            <p className="font-semibold underline">Watch Premium Live</p>
                        </Link>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="p-3">
                        <p className="font-semibold">Members line up</p>
                        {detail?.member_perform?.length === 0 && (
                            <div className="flex">
                                <p className="justify-center text-xl font-medium">Data line up belum tersedia :(</p>
                            </div>
                        )}
                        {detail?.member_perform?.length > 0 && (
                            <div className="grid grid-cols-3 gap-1">
                                {detail?.member_perform?.map((o: JKT48.MemberDetail, i: number) => (
                                    <div
                                        className="h-[180px] w-[85px]"
                                        data-aos={i % 2 === 0 ? "flip-right" : "flip-left"}
                                        key={i}
                                    >
                                        <Link href={`/member/${o.sr_room_url_key?.toLowerCase()}`}>
                                            <Image
                                                src={o.image}
                                                height="120"
                                                width="85"
                                                className="rounded-xl object-fit"
                                                alt={o.full_name}
                                            />
                                            <h2 className="text-sm font-medium">{o.full_name}</h2>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
