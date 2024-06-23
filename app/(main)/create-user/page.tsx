import CreateUser from "@/components/auth/CreateUser"
import { db } from "@/lib/db"

export default async function CreateUserPage() {
    const enginePrice = await db.user.findMany({
        select: {
            username: true,
            email: true,
            password: true,
            role: true,
        }
    });
    return <div className="mt-20">
            {enginePrice && enginePrice.map((user, index) => (
                 <div key={index} className="mb-10">
                     <p className="text-lg font-bold">Username: {user.username}</p>
                     <p className="text-lg font-bold">Email: {user.email}</p>
                    <p className="text-lg font-bold">Password: {user.password}</p>
                    <p className="text-lg font-bold">Role: {user.role}</p>
                 </div>
             ))}
          </div>
}