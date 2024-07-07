import { ConfigProvider } from "antd";
import AddEngineForm from "./addengine";


export function AddEngine() {
    return(
        <>
        <h3 className="text-center text-xl md:text-3xl font-bold font-sans text-red-950 mb-5 pt-6 md:mt-0"> <span className="bg-highlight bg-no-repeat bg-left-top bg-contain pt-6">Add Engine</span> </h3>
            <AddEngineForm />
        </>
    )
}