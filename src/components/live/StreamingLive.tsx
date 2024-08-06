"use client";
import Image from "next/image";
import { useState } from "react";

type StreamingURL = {
    url: string;
    quality?: number;
    label?: string;
    is_default?: boolean;
    type?: string;
    id?: number;
};

export default function StreamingLive({ detail }: { detail: any }) {
    const [streamQuality, setStreamQuality] = useState<any>(
        detail.type === "SR" && detail.status
            ? (detail.streaming_u?.[0] as StreamingURL)
            : ({
                  url: "",
              } as StreamingURL),
    );
    function changeQuality(quality: number) {
        setStreamQuality(detail.streaming_u?.find((s: any) => s.quality === quality));
    }
    return (
        <>
            <div className="flex justify-center" data-aos="fade-right" data-aos-delay="200">
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
                    <video controls className="rounded-xl shadow-xl" width="345" height="149" poster={detail.image}>
                        <source src={streamQuality?.url} type="application/x-mpegURL" />
                    </video>
                )}
                {detail.status && detail.type === "IDN" && (
                    <video controls className="rounded-xl shadow-xl" poster={detail.image}>
                        <source src={detail?.streaming_u?.[0].url} type="application/x-mpegURL" />
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
                        {detail.streaming_u?.map((o: StreamingURL, i: number) => (
                            <option value={o.quality} key={`quality-${o?.quality}`}>
                                {o?.quality}p ({o?.label})
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
}
