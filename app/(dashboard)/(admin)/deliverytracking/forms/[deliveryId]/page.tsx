import Autocomplete from "@/components/delivery/autocomplete";


export default function Page({params}: {params: {deliveryId: string}}) {

    return(
        <>
            <div className="pt-16">
                <h1 className="text-slate-900"> Edit Delivery Information</h1>
                <h1 className="text-slate-900"> Transaction ID: {params.deliveryId}</h1>
                <Autocomplete />
            </div>
        </>
    )
}