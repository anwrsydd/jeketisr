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
        title: "JKT48 Members",
        url: "/members",
    },
    {
        title: "About",
        url: "/about",
    },
];

const PermanentMarker = localFont({
    src: "../fonts/PermanentMarker-Regular.ttf",
});
export default function Header({ className }: { className: string }) {
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
                className={`${className} top-1.5 md:top-2 mx-2 md:mx-4 rounded-xl sticky p-3 shadow-xl bg-gray-200 z-[1000] relative flex p-4 min-h-[4rem]`}
            >
                <div className={`${PermanentMarker.className} left-6 absolute font-bold justify-center flex flex-col`}>
                    <p className="text-xl text-gray-600">JKT48 SR</p>
                </div>
                <div className="absolute right-8">
                    <button onClick={() => show()}>
                        <FontAwesomeIcon className="mt-0.5 text-xl" icon={faBars} />
                    </button>
                </div>
                <motion.div
                    key="animation-on-state"
                    variants={variants}
                    animate={isShow ? "show" : "hide"}
                    initial={{ y: -30, display: "none" }}
                    className="min-w-[8rem] md:min-w-[10rem] absolute right-3 top-[4rem] bg-gray-200 p-3 rounded-b-xl grid grid-cols-1 font-lexend"
                >
                    {menuItems.map((o, i) => {
                        if (isShow) {
                            return (
                                <Link
                                    href={pathname === o.url ? "#" : o.url}
                                    className={`font-medium ${pathname === o.url ? "text-gray-500 font-medium" : "text-black font-medium hover:text-blue-600"}`}
                                    key={`dropdown-${i}`}
                                >
                                    {o.title}
                                </Link>
                            );
                        }
                        if (!isShow) {
                            return (
                                <p
                                    className={`font-medium ${pathname === o.url ? "text-gray-500 font-medium" : "text-black font-medium hover:text-blue-600"}`}
                                    key={`dropdown-${i}`}
                                >
                                    {o.title}
                                </p>
                            );
                        }
                    })}
                </motion.div>
            </header>
        </>
    );
}
