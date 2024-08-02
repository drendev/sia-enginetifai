
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin" || "employee";

  if(!isAdmin) redirect("/");

  return (
    <div className="">
        {children}
    </div>
  );
}
