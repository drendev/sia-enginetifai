import React from "react";

const DeliverySearchGrid: React.FC = () => {
    console.log("DeliverySearchGrid component rendered");
    return (
        <div>
            <h1>Delivery Search Grid</h1>
            <div  className="shadow rounded-lg border border-slate-200 hover:border-red-400 bg-white px-3 py-5
                    cursor-pointer flex items-center flex-col gap-2 transition-all duration-300">
                     <h4 className={'font-semibold text-3xl ${item.color}'}>num</h4>
                     <small className="text-slate-500">unit</small>
                     <div className="flex items-center space-x-2 text-slate-500">
                    
                       <span className="uppercase text-xs">title</span>
                     </div>
                   </div>
        </div>
    );
};

export default DeliverySearchGrid;
