import Image from "next/image";

export default function Signin() {

    return (
        <div className="flex max-md:flex-wrap-reverse max-md:m-5 max-md:mt-5 max-md:gap-10 items-center justify-center m-8 relative gap-10">
            <div className="flex flex-auto w-1/2 relative md:mr-10 h-60">
                <Image src="/logo.png" width={700} height={500} alt="EnginetifAI" />
            </div>
            <div className="flex flex-auto relative md:ml-40 h-60 bg-slate-500 w-full">
                <div className="flex-col h-72 ">
                    Log in
                </div>
            </div>
        </div>
    )
}