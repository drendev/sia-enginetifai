"use client";

import { useEffect, useState } from "react";

interface Engine {
    engineName:  string,
    engineType:  string,
    price:       number,
    description: string,
    quantity:    number,
    picture:     string,
    userAdded:   string,
}

export default function Page({params}: {params: {engineId: string}}) {
    const [engineData, setEngineData] = useState<Engine>();

    useEffect(() => {
        const fetchEngineData = async () => {
            
          const res = await fetch(`/api/engines/engineId?engineId=${params.engineId}`,{
            method: 'POST'
          })
          const data = await res.json()
          JSON.stringify(data)
          setEngineData(data)
        }
    
        fetchEngineData() 
      }, [])

      console.log(engineData)
    return(
        <div className="pt-16">
            <h1>Engine Information {params.engineId} </h1>
            <p>{engineData?.engineName}</p>
            <p>{engineData?.engineType}</p>
            <p>{engineData?.price}</p>
            <p>{engineData?.description}</p>
            <p>{engineData?.quantity}</p>
            <p>{engineData?.picture}</p>
        </div>
    )
}