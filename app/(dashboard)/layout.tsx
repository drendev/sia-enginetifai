
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const isEmployee = session?.user?.role === "employee";

  if(!isAdmin && !isEmployee) redirect("/");

  return (
    <div className="">
        {children}
    </div>
  );
}
