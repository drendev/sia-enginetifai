import Image from "next/image";

export function FirstGrid(){
    return(
        <>
        <div className="md:grid md:grid-rows-3 p-6 max-w-screen-xl mx-auto md:grid-flow-col flex flex-col gap-4">
        <div className="md:row-span-16 h-full bg-red-primary rounded-lg">Charts & Data 
        <Image src={'/maintenance.svg'} alt="waves" width={200} height={200} />
        </div>
        <div className="md:col-span-2 h-32 bg-red-primary rounded-lg">Engines</div>
        <div className="md:row-span-14 md:col-span-2 h-full bg-red-primary rounded-lg">Delivery Transactions</div>
        </div>
        </>
    )
}