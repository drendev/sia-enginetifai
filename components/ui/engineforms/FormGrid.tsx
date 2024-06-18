
export default function Grid({children}: any){
    return(
        <>
        <div className="flex-1 md:row-span-5 md:col-span-1 bg-red-primary/5 rounded-lg md:w-1/2">
        <div className="bg-red-primary/20 min-h-full rounded-lg m-3 p-5">
            {children}
        </div>
        </div>
        </>
    )
}