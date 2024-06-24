
export function AverageDelivery() {
    return(
        <div className="bg-white w-full h-48 bg-deliverybg bg-contain bg-left-bottom bg-no-repeat rounded-xl shadow-md">
            <div className="flex flex-col p-6 space-y-1">
                <h3 className="text-red-900 font-sans font-extrabold text-right"> <span className="text-5xl">Average</span> </h3>
                <h3 className="text-red-900 font-sans font-extrabold text-right mr-14"> <span className="text-xl">of </span> <span className="text-3xl text-[#BB4747]">19.5</span>  </h3>
                <h3 className="text-red-900 font-sans font-extrabold text-right"> <span className="text-xl">deliveries <span className="text-[#BB4747]">monthly</span> </span> </h3>
            </div>
        </div>
    )
}