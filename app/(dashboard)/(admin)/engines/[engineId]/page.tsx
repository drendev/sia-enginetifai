"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext } from "react";
import { Button, Form, Modal } from 'antd';

const ReachableContext = createContext<string | null>(null);
const UnreachableContext = createContext<string | null>(null);

interface Engine {
    engineName:  string,
    engineType:  string,
    price:       number,
    description: string,
    quantity:    number,
    picture:     string,
    userAdded:   string,
}



export default function Page({ params }: { params: { engineId: string } }) {
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
      method: 'POST',
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
        <ReachableContext.Consumer>{(name) => `Are you sure you want to permanently delete this engine?`}</ReachableContext.Consumer>
        <br />
      </>
    ),
  };

  return (
    <div className="pt-16">
      <h1>Engine Information {params.engineId}</h1>
      <p>{engineData?.engineName}</p>
      <p>{engineData?.engineType}</p>
      <p>{engineData?.price}</p>
      <p>{engineData?.description}</p>
      <p>{engineData?.quantity}</p>
      <p>{engineData?.picture}</p>

      <Form
        onFinish={async () => {
          modal.confirm({
            ...config,
            onOk: handleOnSubmit,
          });
        }}
      >
        <ReachableContext.Provider value="Light">
          <Button htmlType="submit">
            Delete
          </Button>
          {contextHolder}
        </ReachableContext.Provider>
      </Form>
    </div>
  );
}
