import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function About() {
    return (
        <div className="m-3 md:mx-6">
            <h2 className="font-semibold text-lg">About</h2>
            <div className="mx-3">
                <div className="p-2 bg-gray-200 rounded-xl text-sm" data-aos="fade-up" data-aos-delay="300">
                    <p>
                        Website ini adalah <em className="font-medium">FANMADE</em> atau{" "}
                        <em className="font-medium">BUKAN DARI OFFICIAL JKT48</em>, website ini dibuat bertujuan untuk
                        memudahkan orang-orang untuk melihat jadwal teater, histori live member JKT48, serta semua fitur
                        yang ada di dalam website ini.
                    </p>
                    <p className="mt-8 font-medium text-base">Follow me</p>
                    <div className="flex space-x-1 text-base">
                        <FontAwesomeIcon icon={faInstagram} className="mt-[3px]" />
                        <Link href="https://instagram.com/@anwr.syd">
                            <p className="font-medium underline">Instagram</p>
                        </Link>
                    </div>
                    <div className="flex space-x-1 text-base">
                        <FontAwesomeIcon icon={faXTwitter} className="mt-[3px]" />
                        <Link href="https://x.com/Meowcraft1">
                            <p className="font-medium underline">X / Twitter</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
