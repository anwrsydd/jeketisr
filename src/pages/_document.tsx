import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>JKT48 SR Log</title>
                <meta
                    name="description"
                    content="Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain."
                />
                <meta
                    name="keywords"
                    content="jkt48, showroom, idn live, jkt48 live, showroom live, 48group, akb48, sr, birthday, cara meminum ramune, pajama drive, ingin bertemu, aturan anti cinta, gold"
                />
                <meta name="author" content="anwrsyd" />
                <meta property="og:title" content="JKT48 SR Log" />
                <meta
                    property="og:description"
                    content="Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain."
                />
                <meta name="google-site-verification" content="dnOshAUt--NQGToTUva4IpX-mGDTbvjTCWt6UzbUojs" />
                <meta property="og:image" content="https://jeketisr.anwrsyd.xyz/metadata-img.jpg" />
                <meta property="og:url" content="https://jeketisr.anwrsyd.xyz/" />
                <meta name="twitter:title" content="JKT48 SR Log" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:description"
                    content="Fanmade website, dibuat untuk melihat aktivitas live member jkt48, melihat jadwal theater minggu ini, dan lain-lain."
                />
                <meta name="twitter:image" content="https://jeketisr.anwrsyd.xyz/metadata-img.jpg" />
                <meta name="twitter:site" content="@defaultsite" />
                <meta name="twitter:creator" content="@defaultcreator" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </Head>
            <body className="bg-gray-300">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
