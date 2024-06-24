import { TodayActivity } from "./todaysactivity";
import { ProductDetails } from "./productdetails";
import { InventorySummary } from "./inventorysummary";
import { AverageDelivery } from "./averagedelivery";
import { ImageRecognition } from "./imagerecognition";

function AdminDashboard () {
  return(
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

export default AdminDashboard;