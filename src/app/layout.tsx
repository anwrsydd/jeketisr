import "@/styles/globals.css";
import { useEffect } from "react";
import { headers } from "next/headers";
import { Metadata } from "next";
import type { AppProps } from "next/app";
import Client from "@/components/Client";
import { Lexend } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const lexend = Lexend({
    subsets: ["latin"],
    variable: "--font-lexend",
});

export const metadata: Metadata = {
    title: {
        template: "%s | JeketiSR",
        default: "JeketiSR",
    },
    description:
        "Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain.",
    icons: {
        icon: [
            {
                rel: "icon",
                type: "image/x-icon",
                url: "/favicon.ico",
            },
            {
                rel: "apple-touch-icon",
                type: "image/png",
                url: "/apple-touch-icon.png",
            },
        ],
    },
    applicationName: "JeketiSR",
    referrer: "origin-when-cross-origin",
    keywords: [
        "JKT48",
        "showroom",
        "gold",
        "idn",
        "birthday",
        "history live",
        "cara meminum ramune",
        "aturan anti cinta",
        "tunas di balik seragam",
        "ingin bertemu",
        "pajama drive",
        "ramune no nomikata",
        "renai kinshi jourei",
        "seifuku no me",
        "aitakatta",
        "pajama drive",
    ],
    authors: [{ name: "AnwrSyd" }],
    creator: "Anwar Syadad",
    publisher: "AnwrSyd",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "JeketiSR",
        description:
            "Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain.",
        images: [{ url: "/metadata-img.jpg", width: 710, height: 450 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "JeketiSR",
        description:
            "Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain.",
        images: [{ url: "/metadata-img.jpg", width: 710, height: 450 }],
    },
};

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-300">
                <Client>{children}</Client>
            </body>
        </html>
    );
}
