import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import localFont from "next/font/local";

interface DropDownItems {
    title: string;
    url: string;
}

const menuItems: DropDownItems[] = [
    {
        title: "Home",
        url: "/",
    },
    {
        title: "Theater Schedule",
        url: "/theater",
    },
    {
        title: "JKT48 Members",
        url: "/members",
    },
    {
        title: "Cek Oshi",
        url: "/cekoshi",
    },
    {
        title: "About",
        url: "/about",
    },
];

const PermanentMarker = localFont({
    src: "../../fonts/PermanentMarker-Regular.ttf",
});
export default function HeaderTransparent({ className }: { className: string }) {
    const variants: any = {
        show: {
            display: "grid",
            y: 0,
            opacity: 1,
            transition: {
                ease: "easeOut",
                duration: 0.6,
            },
        },
        hide: {
            y: -30,
            opacity: 0,
            transitionEnd: {
                display: "none",
            },
            transition: {
                duration: 0.6,
            },
        },
    };
    const pathname = usePathname();
    const [isShow, setIsShow] = useState(false);
    function show(): void {
        setIsShow(!isShow);
    }
    const show_s = isShow ? "grid grid-cols-1" : "hidden";
    return (
        <>
            <header
                className={`${className} top-1.5 md:top-2 mx-2 md:mx-4 rounded-xl sticky p-3 shadow-xl shadow-gray-600/20 backdrop-blur-xl z-[1000] relative flex p-4 min-h-[4rem]`}
            >
                <div className={`${PermanentMarker.className} left-6 absolute font-bold justify-center flex flex-col`}>
                    <h1 className="text-xl text-gray-400">JKT48 SR</h1>
                </div>
                <div className="absolute right-8">
                    <button onClick={() => show()}>
                        <FontAwesomeIcon className="mt-0.5 text-xl" icon={faBars} />
                    </button>
                </div>
            </header>
            <motion.div
                key="animation-on-state"
                variants={variants}
                animate={isShow ? "show" : "hide"}
                initial={{
                    y: -30,
                    display: "none",
                }}
                className="min-w-[8rem] md:min-w-[10rem] absolute right-3 top-[4rem] p-3 backdrop-blur-xl shadow-xl shadow-gray-500/20 rounded-b-xl grid grid-cols-1 font-lexend z-[999]"
            >
                {menuItems.map((o, i) => {
                    if (isShow) {
                        return (
                            <Link
                                href={pathname === o.url ? "#" : o.url}
                                className={`font-medium ${pathname === o.url ? "text-gray-400 font-medium" : "text-gray-300 font-medium hover:text-blue-600"}`}
                                key={`dropdown-${i}`}
                            >
                                {o.title}
                            </Link>
                        );
                    }
                    if (!isShow) {
                        return (
                            <p
                                className={`font-medium ${pathname === o.url ? "text-gray-400 font-medium" : "text-gray-300 font-medium hover:text-blue-600"}`}
                                key={`dropdown-${i}`}
                            >
                                {o.title}
                            </p>
                        );
                    }
                })}
            </motion.div>
        </>
    );
}
