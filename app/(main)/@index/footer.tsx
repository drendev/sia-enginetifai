import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });
export default function Footer() {
    return (
        <>
        <div className="justify-center absolute bottom-0 mb-20">
        <span className={caveat.className}>
        <h2 className="text-5xl text-white"> Dev Abi </h2>
        </span>
        </div>
        </>
    )
}