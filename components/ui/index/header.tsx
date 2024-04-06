import Image from "next/image";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });

export function Header() {
    return(
    <>
    <div className="top-0 absolute w-full p-2 md:p-6 shadow-lg bg-gray-primary">
        <a>
        <div className="flex flex-row ml-4">
        <Image src="/logo.png" width={60} height={60} alt=""/>
        <h1 className="ml-4 self-center font-bold tracking-wider text-xl">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
        </div>
        </a>
    </div>
    <div className="mt-20 sm:hidden">
        <span className={caveat.className}>
        <h2 className="text-2xl text-red-primary text-center"> Future of Inventory Management System </h2>
        </span>
    </div>
    </>
    )
}