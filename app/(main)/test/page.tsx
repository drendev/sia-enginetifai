"use client";

import React from 'react';
import { useState, useEffect } from 'react';

type User = {
  map(arg0: (user: any, index: any) => any): import("react").ReactNode;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const App: React.FC = () => {

     const [user, setUser] = useState<User | null>(null);

    const getUser = async () => {
        const res = await fetch('/api/testapi', {
            method: 'GET'
        });
         const data = await res.json(); 
        setUser(data);
     }

     useEffect(() => {
        getUser();
     }, [])

     return(
         <div className="mt-16">
             {user && user.map((user, index) => (
                 <div key={index} className="mb-10">
                     <p className="text-lg font-bold">Username: {user.username}</p>
                     <p className="text-lg font-bold">Email: {user.email}</p>
                    <p className="text-lg font-bold">Password: {user.password}</p>
                    <p className="text-lg font-bold">Role: {user.role}</p>
                 </div>
             ))}
         </div>
    )
};

export default App;