import Image from "next/image";

export function FirstGrid(){
    return(
        <>
        <div className="md:grid md:grid-rows-3 md:p-6 grid-cols-2 p-3 max-w-screen-xl mx-auto md:grid-flow-col flex flex-col gap-4">
        <div className="md:row-span-16 md:col-span-1 h-full bg-red-primary/5 rounded-lg md:w-full">
            <div className="col-span-3 h-full space-y-4">
                <div className="bg-red-primary/20 h-1/2 rounded-lg m-3">
                    Statistics
                </div>
                <div className="h-1/2 bg-red-primary/20 rounded-lg m-3">
                    Charts
                </div>
            </div>
        
        </div>
        <div className="md:col-span-2 md:h-32 bg-red-primary/5 rounded-lg">Engines</div>
        <div className="md:row-span-14 md:col-span-2 h-full bg-red-primary/5 rounded-lg">Delivery Transactions</div>
        </div>
        
        </>
    )
}