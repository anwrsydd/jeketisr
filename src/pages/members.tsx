import Image from "next/image";
import Link from "next/link";
import { get_members } from "@/lib/utils/fetch_data";

export default function Members({ members }: { members: JKT48.MemberDetail[] }) {
    return (
        <div className="m-2 mx-[2rem] md:mx-[6rem]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {members.map((o, i) => (
                    <div
                        className="relative group h-[181px] w-[128px] justify-self-center"
                        data-aos={i % 2 === 0 ? "zoom-in-right" : "zoom-in-left"}
                        data-aos-delay="200"
                        key={i}
                    >
                        <Link href={`/member/${o.sr_room_url_key.toLowerCase()}`}>
                            <Image
                                src={o.image}
                                alt={o.full_name}
                                width="128"
                                height="181"
                                className="rounded-xl object-fit transition-opacity duration-300 group-hover:opacity-75"
                            />
                            <div className="rounded-xl absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50 transition-opacity duration-300">
                                <h1 className="mx-1 text-gray-200 justify-self-center font-medium text-sm absolute bottom-2">
                                    {o.full_name.split(" /")[0]}
                                </h1>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps(): Promise<Object> {
    const members = await get_members();
    return {
        props: {
            members,
        },
    };
}
