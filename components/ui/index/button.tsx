

import { Button } from "antd"

export default function EngineButton({children}: any) {

    return(
    <>
    <Button
         type="primary" 
         htmlType="submit"
         className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
         >
          {children}
        </Button>
    </>
    )
}