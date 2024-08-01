import { Button, ConfigProvider } from "antd"

export function DeliveryPage() {
    return(
        <>
            <ConfigProvider
            theme={{
                token: {
                colorPrimary: '#BB4747',
                colorLink: '#BB4747',
                colorText: '#BB4747',
                colorBorder: '#BB4747'
                },
            }}>

                <div className="flex-col flex md:px-10">
                    <div className="flex flex-col sm:flex-row md:gap-2">
                        <div className="flex-col md:flex-grow p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-transactionmain bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                                    <h1 className="text-red-100 text-4xl font-sans font-extrabold"> Deliveries </h1>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                                <div className="w-full 2xl:w-full h-[25rem] bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">
                                    Active Deliveries
                                </div>
                                <div className="flex-col md:flex-grow">
                                    <div className="flex flex-col md:grid md:grid-cols-5 gap-5">
                                        <div className="col-span-1 md:col-span-5 md:space-y-5">
                                            <div className="bg-white dark:bg-slate-900 shadow-md md:h-48 rounded-xl p-4 mb-4">
                                                Deliveries Overview
                                            </div>

                                            <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-48 w-full rounded-xl p-4">
                                                Pending Deliveries
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                            <div className="relative md:fixed pt-0 md:pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                                
                            </div>
                        </div>
                    </div>
                </div>

            </ConfigProvider>
        </>
    )
}