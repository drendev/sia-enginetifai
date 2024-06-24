"use client";

import { AverageDelivery } from "./admin/averagedelivery";
import { ImageRecognition } from "./admin/imagerecognition";
import { InventorySummary } from "./admin/inventorysummary";
import { ProductDetails } from "./admin/productdetails";
import { TodayActivity } from "./admin/todaysactivity";

export default function EmployeeDashboard() {
    return (
        <>
            <div className="bg-[#BB4747]/5 h-full px-10">
                <div className="flex gap-2">
                    <div className="flex-col md:flex-grow p-6">
                        <TodayActivity />
                        <ProductDetails />
                    </div>
                    <div className="flex-none w-2/6 space-y-4">
                        <InventorySummary />
                        <AverageDelivery />
                        <ImageRecognition />
                    </div>
                </div>
            </div>
        </>
    )

}