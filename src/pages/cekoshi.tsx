import Link from "next/link";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/router";
import HeaderTransparent from "@/components/HeaderTransparent";

export default function CekOshi() {
    const router = useRouter();
    const [oshi, setOshi] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [userName, setUserName] = useState<string | undefined>();
    const [data, setData] = useState<any[] | undefined>([]);
    useEffect(() => {
        fetch(window.location.protocol + "//" + window.location.host + "/api/member/get?type=string")
            .then((res) => res.json())
            .then((d) => setData(d.result));
    }, []);
    function cekOshi(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setIsLoad(true);
        setUserName((e.currentTarget.elements[0] as HTMLInputElement).value);
        setTimeout(() => {
            setOshi(data?.[Math.floor(Math.random() * data.length)]);
            setIsLoad(false);
        }, 5000);
    }
    function resetOshi(): void {
        setOshi(undefined);
    }
    return (
        <>
            <div
                className="bg-cover min-h-screen w-screen fixed"
                style={{ backgroundImage: "url(/media/background-1.jpg)" }}
            >
                <HeaderTransparent className="text-gray-200" />
                <div className="flex flex-col justify-center items-center min-h-screen -mt-[4rem]">
                    <div className="backdrop-blur-xl p-3 h-[30rem] rounded-lg text-gray-300">
                        <h2
                            className="text-4xl font-semibold bg-clip-text text-transparent from-rose-500 via-blue-700 to-purple-600 bg-gradient-to-r background-animate flex justify-center"
                            data-aos="fade-up"
                        >
                            Cek Oshi
                        </h2>
                        <h3 className="text-sm" data-aos-delay="200" data-aos="fade-right">
                            Cek siapa oshi kamu berdasarkan nama kamu
                        </h3>
                        {!oshi && !isLoad && (
                            <form className="flex items-center mt-[8rem] flex-col mb-4" onSubmit={cekOshi}>
                                <input
                                    className="focus:outline-none border-b-2 border-gray-300 bg-transparent p-2"
                                    type="text"
                                    placeholder="Nama kamu"
                                    name="name"
                                    data-aos-delay="300"
                                    data-aos="fade-left"
                                    required
                                />
                                <button
                                    className="mt-3 p-2 rounded-md bg-gradient-to-r from-rose-500 to-purple-600 background-animate rounded-md"
                                    data-aos-delay="300"
                                    data-aos="fade-up"
                                >
                                    Cek Oshi
                                </button>
                            </form>
                        )}
                        {isLoad && !oshi && (
                            <div className="mb-4 mt-[8rem] flex justify-center" data-aos="fade-left">
                                <p>Sabar, lagi ngecek oshi ...</p>
                            </div>
                        )}
                        {!isLoad && oshi && (
                            <>
                                <div
                                    className="mt-[2rem] flex justify-center flex-col items-center gap-1"
                                    data-aos="fade-left"
                                >
                                    <h4>{userName}, oshi kamu adalah</h4>
                                    <p className="text-xl font-semibold">{oshi}</p>
                                </div>
                                <div className="mt-[6rem] mb-4 flex justify-center">
                                    <button
                                        className="p-2 bg-gradient-to-r from-rose-500 to-purple-600 background-animate rounded-md"
                                        onClick={resetOshi}
                                        data-aos="fade-up"
                                    >
                                        Cek oshi lagi
                                    </button>
                                </div>
                            </>
                        )}
                        <div className="flex justify-center gap-1 text-sm">
                            <h5 className="relative absolute bottom-0">&copy;</h5>
                            <h5 className="relative absolute bottom-0">{new Date().getFullYear()}</h5>
                        </div>
                        <p className="text-sm flex justify-center relative absolute bottom-0">
                            Created by{" "}
                            <Link className="ml-1 text-blue-600" href="https://instagram.com/anwr.syd">
                                AnwrSyd
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
