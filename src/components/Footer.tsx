import Link from "next/link";

export default function Footer() {
    return (
        <footer className="p-3 bg-white/40">
            <div className="flex justify-center">
                <p className="font-semibold">
                    &copy; {new Date().getFullYear()}
                </p>
            </div>
            <div className="flex justify-center space-x-1">
                <p className="font-medium">Dibuat oleh</p>
                <Link href="https://instagram.com/@anwr.syd" title="Instagram">
                    <h4 className="font-semibold text-blue-600">AnwrSyd</h4>
                </Link>
            </div>
        </footer>
    );
}
