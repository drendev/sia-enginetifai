"use client";

import Link from "next/link";
import { Button, ConfigProvider, Image, Form, Modal } from "antd";
import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/navigation";
import { CameraOutlined } from "@ant-design/icons";

const ReachableContext = createContext<string | null>(null);
const UnreachableContext = createContext<string | null>(null);

interface Engine {
  userAdded: string;
  engineName: string;
  engineType: string;
  price: number;
  quantity: string;
  picture: string;
}

export default function EnginePageGrid({
  params,
}: {
  params: { engineId: string };
}) {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const [engineData, setEngineData] = useState<Engine | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (isDeleted) return;

    const fetchEngineData = async () => {
      const res = await fetch(`/api/engines/engineId?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = await res.json();
      setEngineData(data);
    };
    fetchEngineData();
  }, [params.engineId, isDeleted]);

  const handleOnSubmit = async () => {
    const response = await fetch('/api/engines/delete', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engineName: engineData?.engineName,
      }),
    });

    if (response.ok) {
      setIsDeleted(true);
      router.push('/engines');
    } else {
      console.log('Something went wrong.');
    }
  };

  if (isDeleted) {
    return null;
  }

  const config = {
    title: `Delete ${engineData?.engineName}`,
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `Are you sure you want to permanently delete this engine?`}
        </ReachableContext.Consumer>
        <br />
      </>
    ),
  };

  return (
    <>
      <div className="h-full bg-red-primary/5 pt-10 pb-10 md:pb-0 md:pt-16">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#BB4747',
              colorLink: '#BB4747',
              colorText: '#BB4747',
              colorBorder: '#BB4747',
              colorPrimaryBg: '#BB4747',
            },
          }}
        >
          <div className="h-full flex-col flex md:px-10">
            <div className="flex flex-col sm:flex-row md:gap-2">
              <div className="flex-col md:flex-grow p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between w-full h-52 rounded-2xl shadow-xl bg-enginebackground bg-right-bottom bg-contain bg-no-repeat bg-red-primary px-7 py-5 gap-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-red-100 text-4xl font-sans font-extrabold">
                        {engineData?.engineName}
                      </h1>
                      <h1 className="text-red-100 text-xl font-sans font-extrabold">
                        Type: {engineData?.engineType}
                      </h1>
                      <h1 className="text-red-100 text-md font-sans font-semibold">
                        Available stocks: {engineData?.quantity}
                      </h1>
                      <h1 className="text-red-100 text-md font-sans font-semibold">
                        Price: {engineData?.price}
                      </h1>
                    </div>
                    <div className="pr-6">
                      <Image
                        src={`${engineData?.picture}`}
                        alt="AI"
                        width={170}
                        height={170}
                        className="self-center"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-6 mt-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Edit Engine
                    </Button>
                    <Form
                      onFinish={async () => {
                        modal.confirm({
                          ...config,
                          onOk: handleOnSubmit,
                          okText: 'Confirm Delete',
                          okType: 'danger',
                        });
                      }}
                    >
                      <ReachableContext.Provider value="Light">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="bg-red-primary/90 hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                        >
                          Delete Engine
                        </Button>
                        {contextHolder}
                      </ReachableContext.Provider>
                    </Form>
                  </div>
                  <div className="w-full 2xl:w-full h-80 bg-white shadow-md rounded-xl p-4">
                    <div className="text-red-900 text-2xl font-sans font-extrabold space-y-2">
                      Specifications
                    </div>
                    <h3>Test Specs</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                      
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
