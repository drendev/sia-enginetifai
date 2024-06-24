
export function InventorySummary() {
    return(
        <div className="flip-card flex flex-col space-y-5 pt-5">
            <div className="flip-card-inner flex flex-col w-full h-52 rounded-2xl shadow-xl cursor-pointer">
                <div className="flip-card-front bg-bgcard bg-bottom bg-cover bg-no-repeat p-7">
                    <h3 className="text-red-50 text-3xl font-sans font-extrabold">Inventory Summary</h3>
                    <h3 className="text-red-100 text-2xl font-sans font-extrabold pt-16">Hello, Aldren!</h3>
                    <h3 className="text-red-100 text-lg">June 24, 2024</h3>
                </div>
                <div className="flip-card-back p-7 rounded-2xl">
                    <h3 className="text-white text-3xl font-sans font-extrabold">Balik mo 38 ko</h3>
                    <p className="text-white">Sana pag gising ko mabalik na.</p>
                </div>
            </div>
        </div>
    )
}