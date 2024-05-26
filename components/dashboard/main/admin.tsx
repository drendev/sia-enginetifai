import Image from "next/image";

export default async function AdminDashboard () {
  return(
    <>
      <div>
        <h1>Testing Page Speed</h1>
        <Image src="/maintenance.svg" alt="admin" width={500} height={500} />
        <Image src="/secured.svg" alt="admin" width={500} height={500} />
        <Image src="/tracking.svg" alt="admin" width={500} height={500} />
        <Image src="/visual.svg" alt="admin" width={500} height={500} />
      </div>
    </>
  )
}
