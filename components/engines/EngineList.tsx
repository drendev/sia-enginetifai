"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Engine {
    id:          number,
    engineName:  string,
    engineType:  string,
    price:       number,
    quantity:    number,
    picture:     string,
}

export function EngineList() {
    const [engineData, setEngineData] = useState<Engine[]>([]);

    useEffect(() => {
        const fetchEngineData = async () => {
            
          const res = await fetch('/api/engines/allenginelist',{
            method: 'POST'
          })
          const data = await res.json()
          JSON.stringify(data)
          setEngineData(data)
        }
    
        fetchEngineData() 
      }, [])

    return (
        <>
            <div>
                {engineData.map((engine, index) => (
                    <Link key={index} href={`/engines/${engine.id}`}>
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <p className="text-lg font-bold">Engine Name: {engine.engineName}</p>
                        <img src={engine.picture} alt="Engine Picture" className="w-20 h-20"/>
                    </div>
                    </Link>
                ))}
            </div>
        </>
    )
}