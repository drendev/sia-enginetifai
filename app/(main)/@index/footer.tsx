import { Caveat } from "next/font/google";
import Image from "next/image";

const caveat = Caveat({ subsets: ["latin"] });
export default function Footer() {
    return (
        <>
        <div className="absolute bottom-0 md:mt-0 md:mb-20 max-sm:hidden">
        <span className={caveat.className}>
        <h2 className="text-5xl text-white"> Future of Inventory Management System </h2>
        </span>
        </div>
        </>
    )
}