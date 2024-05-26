import Image from "next/image";
import { Suspense } from "react";

export default async function AdminDashboard () {
  return(
    <>
      <div>
        <h1>Testing Page Speed</h1>
        <Suspense fallback={<div>Loading...</div>}>
        <Image src="/maintenance.svg" alt="admin" width={500} height={500} />
        <Image src="/secured.svg" alt="admin" width={500} height={500} />
        <Image src="/tracking.svg" alt="admin" width={500} height={500} />
        <Image src="/visual.svg" alt="admin" width={500} height={500} />
        </Suspense>
      </div>
    </>
  )
}
