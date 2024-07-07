
export default function Grid({children}: any){
    return(
        <>
        <div className="flex-1 md:row-span-5 md:col-span-1 rounded-lg md:w-1/2">
        <div className="bg-white min-h-full rounded-lg m-3 p-5 shadow-lg">
            {children}
        </div>
        </div>
        </>
    )
}