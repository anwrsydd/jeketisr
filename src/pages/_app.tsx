import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Lexend } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const lexend = Lexend({
    subsets: ["latin"],
    variable: "--font-lexend",
});

export default function App({ Component, pageProps, router }: AppProps) {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    });
    const specialPages = ["/cekoshi"];
    if (specialPages.includes(router.pathname)) {
        return (
            <main className={`${lexend.variable} font-lexend`}>
                <Component {...pageProps} />
            </main>
        );
    }
    return (
        <>
            <Head>
                <title>JKT48 SR Log</title>
            </Head>
            <Header className={lexend.variable} />
            <div className="overflow-auto min-h-screen" key={router.route}>
                <main className={`m-4 md:mx-14 ${lexend.variable} font-lexend`}>
                    <Component {...pageProps} />
                </main>
            </div>
            <Footer />
        </>
    );
}
