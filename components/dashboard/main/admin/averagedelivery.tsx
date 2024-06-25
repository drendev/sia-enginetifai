
export function AverageDelivery() {
    return(
        <div className="bg-white w-full h-48 bg-deliverybg md:bg-contain bg-16 bg-left-bottom md:bg-left bg-no-repeat rounded-xl shadow-md">
            <div className="flex flex-col p-6 space-y-1">
                <h3 className="text-red-900 font-sans font-extrabold text-right"> <span className="text-2xl md:text-5xl">Average</span> </h3>
                <h3 className="text-red-900 font-sans font-extrabold text-right mr-4 md:mr-14"> <span className="text-lg md:text-xl">of </span> <span className="text-2xl md:text-3xl text-[#BB4747]">19.5</span>  </h3>
                <h3 className="text-red-900 font-sans font-extrabold text-right"> <span className="text-lg md:text-xl">deliveries <span className="text-[#BB4747] block md:inline-block">monthly</span> </span> </h3>
            </div>
        </div>
    )
}