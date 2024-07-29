import Link from "next/link";

export default function ErrorMsg() {
    return (
        <div className="m-2 mt-4">
            <p className="text-xl">There&apos;s something error, please try again or back to homepage</p>
            <p className="text-base">You can contact the developer if the error occurs repeatedly.</p>
            <Link href="/">
                <p className="text-blue-600">Back to homepage</p>
            </Link>
        </div>
    );
}
