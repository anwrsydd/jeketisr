import Image from "next/image";
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
import { get_live_detail } from "@/lib/utils/get_history_live";
import {
    numberWithCommas,
    count_time,
    convertCurrency,
} from "@/lib/utils/additional";
import moment from "moment-timezone";
import "moment/locale/id";
import { useState } from "react";
import axios from "axios";
import ErrorMsg from "@/components/ErrorMsg";

type GiftIDR = {
    from?: string;
    to?: string;
    res?: number;
    rates?: number;
};

type StreamingURL = {
    url: string;
    quality?: number;
    label?: string;
    is_default?: boolean;
    type?: string;
    id?: number;
};
type Detail = JKT48.LastLive & {
    streaming_u?: StreamingURL[];
    gift_idr?: GiftIDR;
    error?: boolean;
};

export default function LiveDetail(props: { detail: Detail }) {
    const { detail } = props;
    const [streamQuality, setStreamQuality] = useState<any>(
        detail.type === "SR" && detail.status
            ? (props.detail.streaming_u?.[0] as StreamingURL)
            : ({
                  url: "",
              } as StreamingURL),
    );
    function changeQuality(quality: number) {
        setStreamQuality(
            props.detail.streaming_u?.find((s: any) => s.quality === quality),
        );
    }
    if (props.detail.error) {
        return <ErrorMsg />;
    }
    return (
        <div className="m-2 mt-6 md:mx-8">
            <div
                className="flex justify-center"
                data-aos="fade-right"
                data-aos-delay="200"
            >
                {!detail.status && (
                    <Image
                        src={detail.image}
                        width="329"
                        height="185"
                        className="w-[329px] h-[185px] object-cover rounded-xl shadow-xl"
                        alt={detail.name}
                    />
                )}
                {detail.status && detail.type === "SR" && (
                    <video
                        controls
                        className="rounded-xl shadow-xl"
                        width="345"
                        height="149"
                        poster={detail.image}
                    >
                        <source
                            src={streamQuality?.url}
                            type="application/x-mpegURL"
                        />
                    </video>
                )}
                {detail.status && detail.type === "IDN" && (
                    <video
                        controls
                        className="rounded-xl shadow-xl"
                        poster={detail.image}
                    >
                        <source
                            src={detail?.streaming_u?.[0].url}
                            type="application/x-mpegURL"
                        />
                    </video>
                )}
            </div>
            {detail.status && detail.type === "SR" && (
                <div className="mt-2 md:mx-16">
                    <select
                        defaultValue={streamQuality.quality}
                        onChange={(e) => changeQuality(Number(e.target.value))}
                        className="p-2 rounded-xl"
                    >
                        {props.detail.streaming_u?.map((o, i) => (
                            <option
                                value={o.quality}
                                key={`quality-${o?.quality}`}
                            >
                                {o?.quality}p ({o?.label})
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="bg-gray-100 rounded-xl shadow-lg p-3 mt-3 md:mx-16">
                {detail.status && (
                    <div className="flex space-x-1">
                        <span className="bg-red-500 w-4 h-4 rounded-full animate-fade mt-1"></span>
                        <p className="text-base">Now Live!</p>
                    </div>
                )}
                <h1 className="text-base font-medium mb-2">{detail.name}</h1>
                <div className="flex space-x-1">
                    <FontAwesomeIcon
                        icon={faClock}
                        className="text-xl mt-2 mr-1"
                    />
                    <div className="shadow-inner bg-gray-200 p-2 rounded-xl w-[244px] md:w-full">
                        <p className="font-medium text-sm">
                            {moment(detail.live_at * 1000).format(
                                "DD MMMM YYYY HH:mm",
                            )}{" "}
                            {!detail.status
                                ? "— " +
                                  moment(detail.end_at * 1000).format(
                                      "DD MMMM YYYY HH:mm",
                                  )
                                : ""}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-1 mt-1">
                    <FontAwesomeIcon
                        icon={faComment}
                        className="text-xl mt-2 mr-1"
                    />
                    <div className="shadow-inner bg-gray-200 p-2 rounded-xl w-[244px] md:w-full">
                        <p className="font-medium text-sm">
                            {numberWithCommas(detail.comment)} Komentar
                        </p>
                    </div>
                </div>
                <div className="flex space-x-1 mt-1">
                    <FontAwesomeIcon icon={faGifts} className="text-xl mt-2" />
                    <div className="shadow-inner bg-gray-200 p-2 rounded-xl mr-0.5 w-[244px] md:w-full">
                        <p className="font-medium text-sm">
                            {numberWithCommas(detail.paid_gift)} Gold{" "}
                            {detail.type === "SR"
                                ? "(± " +
                                  detail.gift_idr?.res?.toLocaleString(
                                      "id-ID",
                                      {
                                          style: "currency",
                                          currency: "IDR",
                                      },
                                  ) +
                                  ")"
                                : ""}
                        </p>
                    </div>
                </div>
                {!detail.status && (
                    <div className="flex space-x-1 mt-1">
                        <FontAwesomeIcon
                            icon={faStopwatch}
                            className="text-xl mt-2 mr-2"
                        />
                        <div className="shadow-inner bg-gray-200 p-2 rounded-xl w-[244px] md:w-full">
                            <p className="font-medium text-sm">
                                {count_time(detail.live_at, detail.end_at)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-gray-100 rounded-xl shadow-lg p-3 mt-3 md:mx-16">
                <h1 className="font-semibold">Top Viewers</h1>
                <div className="grid grid-cols-1 gap-2 p-3 shadow-inner bg-gray-200 rounded-xl">
                    {detail.top_v.map((o: any, i) => {
                        if (detail.type === "IDN") {
                            return (
                                <div
                                    className="flex gap-2"
                                    key={i}
                                    data-aos={
                                        i % 2 === 0
                                            ? "fade-up-left"
                                            : "fade-up-down"
                                    }
                                    data-aos-delay="300"
                                >
                                    <Image
                                        src={o.image_url}
                                        width="35"
                                        height="35"
                                        className="rounded-full object-cover"
                                        alt={o.rank}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm">{o.name}</p>
                                        <p className="text-sm italic">
                                            {o.total_gold} Gold
                                        </p>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    className="flex gap-2"
                                    key={i}
                                    data-aos={
                                        i % 2 === 0
                                            ? "fade-down-left"
                                            : "fade-up-right"
                                    }
                                    data-aos-delay="300"
                                >
                                    <Image
                                        src={o.user.avatar_url}
                                        width="35"
                                        height="35"
                                        className="rounded-full"
                                        alt={o.rank}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm">{o.user.name}</p>
                                        <p className="text-sm italic">
                                            {o.total_gold} Gold
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const id = Number(context.params.id);
    const detail = await get_live_detail(id);
    if (detail.length < 1) {
        return {
            props: {
                detail: {
                    error: true,
                },
            },
        };
    } else {
        try {
            if (detail[0].type === "SR") {
                if (detail[0].status) {
                    const get_live_s_url = await axios.get(
                        "https://www.showroom-live.com/api/live/streaming_url?room_id=" +
                            detail[0].url.split("room_id=")[1],
                    );
                    const dt = get_live_s_url.data.streaming_url_list.filter(
                        (e: StreamingURL) => e?.type === "hls",
                    );
                    return {
                        props: {
                            detail: {
                                ...detail[0],
                                gift_idr: {
                                    res: 0,
                                },
                                streaming_u: dt,
                            },
                        },
                    };
                } else {
                    const gifts = await convertCurrency(
                        "JPY",
                        "IDR",
                        detail[0].paid_gift,
                    );
                    return {
                        props: {
                            detail: {
                                ...detail[0],
                                gift_idr: gifts,
                            },
                        },
                    };
                }
            } else {
                if (detail[0].status) {
                    const get_live_s_url = await fetch(
                        "https://" +
                            context.req.headers.host +
                            "/api/live/idn_stream_url?u=" +
                            detail[0].url.split("idn.app/")[1],
                    );
                    const dt_r = await get_live_s_url.json();
                    const dt = dt_r.result[0].playback_url;
                    return {
                        props: {
                            detail: {
                                ...detail[0],
                                gift_idr: {
                                    res: 0,
                                },
                                streaming_u: [
                                    {
                                        url: dt,
                                    },
                                ],
                            },
                        },
                    };
                } else {
                    return {
                        props: {
                            detail: {
                                ...detail[0],
                                gift_idr: {
                                    res: 0,
                                },
                            },
                        },
                    };
                }
            }
        } catch {
            return {
                props: {
                    detail: {
                        error: true,
                    },
                },
            };
        }
    }
}
