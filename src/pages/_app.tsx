import "@/styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
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
    return (
        <>
            <Header className={lexend.variable} />
            <div className="overflow-auto min-h-screen" key={router.route}>
                <main className={`m-4 md:mx-16 ${lexend.variable} font-lexend`}>
                    <Component {...pageProps} />
                </main>
            </div>
            <Footer />
        </>
    );
}
