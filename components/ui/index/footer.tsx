import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });
export default function Footer() {
    return (
        <>
        <footer className="absolute bottom-0 md:mt-0 h-24 max-sm:hidden">
        <span className={caveat.className}>
        <h2 className="text-5xl text-white"> Future of Inventory Management System </h2>
        </span>
        </footer>
        </>
    )
}