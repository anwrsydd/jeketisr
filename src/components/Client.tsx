"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import React from "react";
import AOS from "aos";
import { Lexend } from "next/font/google";

const lexend = Lexend({
    subsets: ["latin"],
    variable: "--font-lexend",
});

export default function Client({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000,
        });
    });
    const specialPages = ["/cekoshi"];
    if (specialPages.includes(pathname)) {
        return <main className={`${lexend.variable} font-lexend`}>{children}</main>;
    }
    return (
        <>
            <Header className={lexend.variable} />
            <div className="overflow-auto min-h-screen w-screen">
                <main className={`m-4 md:mx-14 ${lexend.variable} font-lexend`}>{children}</main>
            </div>
            <Footer />
        </>
    );
}
