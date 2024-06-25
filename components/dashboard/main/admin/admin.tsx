import { TodayActivity } from "./todaysactivity";
import { ProductDetails } from "./productdetails";
import { InventorySummary } from "./inventorysummary";
import { AverageDelivery } from "./averagedelivery";
import { ImageRecognition } from "./imagerecognition";

function AdminDashboard () {
  return(
  <>
    <div className="h-full flex-col flex md:px-10">
        <div className="flex flex-col sm:flex-row md:gap-2">
            <div className="flex-col md:flex-grow p-6">
                <TodayActivity />
                <ProductDetails />
            </div>
            <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0">
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