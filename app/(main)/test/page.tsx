"use client";

import React, { useState, useEffect } from 'react';

type User = {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    const getUsers = async () => {
        try {
            const res = await fetch('/api/testapi',
                {
                    method: 'POST',
                }
            );
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getUsers();
        const interval = setInterval(() => {
            getUsers();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    console.log(users)

    return (
        <div className="mt-16">
            {users.map((user, index) => (
                <div key={index} className="mb-10">
                    <p className="text-lg font-bold">Username: {user.username}</p>
                    <p className="text-lg font-bold">Email: {user.email}</p>
                    <p className="text-lg font-bold">Password: {user.password}</p>
                    <p className="text-lg font-bold">Role: {user.role}</p>
                </div>
            ))}
        </div>
    );
};

export default App;
