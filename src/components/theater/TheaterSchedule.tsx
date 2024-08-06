"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import "moment/locale/id";

moment.tz.setDefault("Asia/Jakarta");

export default function TheaterSchedule() {
    const [showlist, setShowList] = useState<any>([]);
    const [isLoad, setIsLoad] = useState(true);
    useEffect(() => {
        fetch("/api/theater/list")
            .then((res) => res.json())
            .then((d) => {
                setShowList(d);
                setIsLoad(false);
            });
    }, []);
    return (
        <>
            {isLoad && <p>Loading...</p>}
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
                                    <p>{moment(o.show_date * 1000).format("dddd, DD MMMM YYYY HH:mm")} WIB</p>
                                </div>
                                <h4 className="text-base font-medium">Performing members</h4>
                                <div className="px-1.5 py-3 bg-gray-400/50 snap-x snap-mandatory flex gap-6 overflow-x-auto rounded-md shadow-inner mb-2">
                                    {o.member_perform.length === 0 && (
                                        <p className="text-base">Data belum tersedia untuk saat ini :(</p>
                                    )}
                                    {o.member_perform.map((d: JKT48.MemberDetail, ii: number) => (
                                        <div
                                            className="snap-always shrink-0 snap-align-none hover:text-blue-600"
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
        </>
    );
}
