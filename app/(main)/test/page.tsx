
type User = {
    id: number;
    username: string;
    email: string;
    role: string;
}

export default async function UserPage(){
    const response = await fetch('http://localhost:3000/api/testapi');
    const users = await response.json();

    return(
        <div className="mt-16">
            {users && users.map((user:User) => (
                <div key={user.id} className="bg-white shadow-md p-4 rounded-md">
                    <h1 className="text-xl font-semibold">{user.username}</h1>
                    <p className="text-lg">{user.email}</p>
                    <p className="text-lg">{user.role}</p>
                </div>
            ))}
        </div>
    )
}