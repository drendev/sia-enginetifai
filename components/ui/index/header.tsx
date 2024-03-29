import Image from "next/image";

export function Header() {
    return(
    <div className="flex flex-col top-0 fixed w-full p-6 shadow-xl bg-gray-primary">
        <div className="flex flex-row ml-4">
        <Image src="/logo.png" width={60} height={60} alt=""/>
        <h1 className="ml-4 self-center font-bold tracking-wide text-xl">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
        </div>
    </div>
    )
}