import { get_history_live, get_data_length } from "../lib/utils/get_history_live";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComment, faGifts, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import "moment/locale/id";
import { numberWithCommas, count_time } from "../lib/utils/additional";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HistoryLive({
    last_live,
    q,
    total_data,
    error,
}: {
    last_live: JKT48.LastLive[];
    q: number;
    total_data: number;
    error: boolean;
}) {
    if (error) {
        return (
            <div className="m-2">
                <p>Not found</p>
                <Link className="text-blue-500" href="/">
                    Back to homepage
                </Link>
            </div>
        );
    }
    return (
        <>
            <div className="grid grid-cols-1 gap-4">
                {last_live.map((obj, indx) => (
                    <div
                        className="w-72 h-[20rem] shadow-xl bg-gray-200 rounded-xl justify-self-center"
                        key={indx}
                        data-aos="fade-right"
                        data-aos-delay="300"
                    >
                        <Link href={`/live/${obj.d_id}`}>
                            <div className="relative">
                                <Image
                                    src={obj.image}
                                    className="w-[288px] h-[155px] object-cover shrink-0"
                                    width="240"
                                    height="135"
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
            <div className="mt-4">
                <p className="flex gap-1 mb-3">
                    Showing
                    <span className="font-semibold">{10 * q - 10}</span>
                    to
                    <span className="font-semibold">{10 * q}</span>
                    of
                    <span className="font-semibold">{total_data}</span>
                    data
                </p>
                {q !== 1 && (
                    <Link className="m-3 p-3 bg-gray-400/60 shadow-xl rounded-xl" href={`/history-live?q=${q - 1}`}>
                        Previous
                    </Link>
                )}
                {10 * q < total_data && (
                    <Link className="m-3 p-3 bg-gray-400/60 shadow-xl rounded-xl" href={`/history-live?q=${q + 1}`}>
                        Next
                    </Link>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps(context: any): Promise<Object> {
    const getDataLength = await get_data_length("jkt48_live_history");
    const totalPages: number = Math.ceil(getDataLength / 10);
    let q: number = context.query?.q !== undefined ? parseInt(context.query.q) : 1;
    if (q === undefined || q === null || isNaN(q)) {
        q = 1;
    }
    if (q > totalPages) {
        return {
            props: {
                last_live: [],
                q,
                total_data: 0,
                error: true,
            },
        };
    } else {
        const last_live = await get_history_live(10 * q - 10, 10 * q);
        return {
            props: {
                last_live,
                q,
                total_data: getDataLength,
                error: false,
            },
        };
    }
}
