

import { Button } from "antd"
import { useState } from "react"

export default function EngineButton({children}: any) {
const [loadings, setLoadings] = useState<boolean[]>([]);

const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
    });

    setTimeout(() => {
        setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
        });
    }, 10000);
    };

    return(
    <>
    <Button
         type="primary" 
         htmlType="submit"
         className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
         loading={loadings[2]}
         onClick={() => enterLoading(2)}
         >
          {children}
        </Button>
    </>
    )
}