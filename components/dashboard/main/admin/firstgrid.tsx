import Image from "next/image";

export function FirstGrid(){
    return(
        <>
        <div className="md:grid md:grid-rows-3 md:p-6 grid-cols-2 p-3 max-w-screen-xl mx-auto md:grid-flow-col flex flex-col gap-4">
        <div className="md:row-span-5 md:col-span-1 bg-red-primary/5 rounded-lg md:w-full">
            <div className="md:col-span-1 md:h-full h-full space-y-4">
                <div className="bg-red-primary/20 h-52 rounded-lg m-3">
                    Statistics Dashboard
                </div>
                <div className="bg-red-primary/20 h-[24.5rem] rounded-lg m-3">
                    Charts
                </div> 
            </div>
        
        </div>
        <div className="md:col-span-1 md:row-span-1 md:h-48 bg-red-primary/5 rounded-lg">
            <div className="bg-red-primary/20 h-[10.5rem] rounded-lg m-3">
                Recent Engines
            </div>
        </div>
        <div className="md:row-span-4 md:col-span-1 h-full bg-red-primary/5 rounded-lg">
            <div className="bg-red-primary/20 h-[25.5rem] rounded-lg m-3">
                Transactions
            </div>
        </div>
        </div>
        
        </>
    )
}