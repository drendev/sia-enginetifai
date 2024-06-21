import { FirstGrid } from "./firstgrid";
import { SalesOverview } from "./salesoverview";
import { SecondGrid } from "./secondgrid";
import ThirdGrid from "./thirdgrid";

function AdminDashboard () {
  return(
    <>
      <SalesOverview />
      <SecondGrid/>
      <ThirdGrid/>
      <FirstGrid />
    </>
  )
}

export default AdminDashboard;