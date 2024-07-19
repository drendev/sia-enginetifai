'use client'

import * as z from 'zod';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, Upload, ConfigProvider, Select, Spin, notification, Col, Row } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import EngineButton from '../../ui/index/button';
import { DieselEngine } from '../specification/engines/dieselengine';
import { DieselWaterPump } from '../specification/pumps/dieselwaterpump';
import Grid from '../../ui/engineforms/FormGrid';
import { TwinCylinderDiesel } from '../specification/engines/twincylinderdieselengine';
import { DieselGenerator } from '../specification/generators/dieselgenerator';
import { TwinCylinderDieselGenerator } from '../specification/generators/twincylinderdieselgenerator';
import { DieselHighPump } from '../specification/pumps/dieselhighpump';
import { DieselIronPump } from '../specification/pumps/dieselironpump';
import { GasolineEngine } from '../specification/engines/gasolineengine';
import { GasolineVertical } from '../specification/engines/gasolinevertical';
import { GasolineGenerator } from '../specification/generators/gasolinegenerator';
import { SilentGasolineGenerator } from '../specification/generators/silentgasolinegenerator';
import { TwinCylinderGasolineGenerator } from '../specification/generators/twincylindergasolinegenerator';
import { LiquifiedAndLptGenerator } from '../specification/generators/liquifiedandlptgenerator';
import { PortableGasolineGenerator } from '../specification/generators/portablegasolinegenerator';
import { GasolineWaterPump } from '../specification/pumps/gasolinewaterpump';
import { GasolineHighPump } from '../specification/pumps/gasolinehighpump';
import { GasolineIronPump } from '../specification/pumps/gasolineironpump';
import { DieselAndGasolineTrashPump } from '../specification/pumps/dieselandgasolinetrashpump';
import { InverterGenerator } from '../specification/generators/invertergenerator';
import { DieselWeldingGenerator } from '../specification/generators/dieselweldinggenerator';
import { Tillers } from '../specification/tillers/tillers';
import { NoSpecification } from '../specification/nospecification';

const FormSchema = z
.object({
  userName: z.string().min(5, 'Username Max Limit.').max(30),
  engineName: z.string().min(5, 'Engine Max Limit.').max(30),
  engineType: z.string().min(8, 'Engine Type is required').max(100),
  price: z.number().min(1, 'Price is required').max(100),
  quantity: z.number().min(1, 'Quantity is required').max(100),
  picture: z.string().min(5, 'Picture is required').max(100),
  description: z.string().min(5, 'Description is required').max(250),
    // Specification fields
    BorexStroke: z.string().optional(), Displacement: z.string().optional(), EngineSpeed: z.string().optional(), RatedOutput: z.string().optional(),
    MaxOutPut: z.string().optional(), LubeOilCapacity: z.string().optional(), FuelTankCapacity: z.string().optional(), FuelConsumption: z.string().optional(),
    Dimension: z.string().optional(),NetWeight: z.string().optional(), PackageDimension: z.string().optional(), GrossWeight: z.string().optional(),
    LoadingQty: z.string().optional(), RateACOutput: z.string().optional(), MaxACOutput: z.string().optional(), Noise: z.string().optional(),
    StartingSystem: z.string().optional(), Frequency: z.string().optional(), PowerFactor: z.string().optional(), EngineModel: z.string().optional(),
    DCOutput: z.string().optional(), Voltage: z.string().optional(), Inlet: z.string().optional(), MaxCapacity: z.string().optional(),
    MaxDischarge: z.string().optional(), SelfPrimingTime: z.string().optional(), MaxSuctionHead: z.string().optional(), Kw3600: z.string().optional(),
    Kw3000: z.string().optional(), Kw2600: z.string().optional(), MaxNetTorque: z.string().optional(), CompressionRatio: z.string().optional(),
    IdleSpeed: z.string().optional(), EngineOilCapacity: z.string().optional(), Size: z.string().optional(), ContinuousOpHours: z.string().optional(),
    Type: z.string().optional(), RunningTime: z.string().optional(), Optional: z.string().optional(), NoLoadVoltage: z.string().optional(),
    OperatingWelding: z.string().optional(), OperatingCurrent: z.string().optional(), MaxArcingCurrent: z.string().optional(), DutyCycle: z.string().optional(),
    EngineRatedPower: z.string().optional(), TillingWidth: z.string().optional(), TransmissionMode: z.string().optional(), PackingSize: z.string().optional(),
    TillingDepth: z.string().optional(), ShiftingGears: z.string().optional(), TransportingWheel: z.string().optional(), TillingBlades: z.string().optional(),
    ContLoad20: z.string().optional(), ContLoad40: z.string().optional(), NetPower: z.string().optional(), DisplacementBore: z.string().optional(), 
    EngineType: z.string().optional(), Weight: z.string().optional()
})

interface Engine {  
  engineName: string
}

type NotificationType = 'error';

const AddEngineForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [file, setFile] = useState<File | undefined>();
    const [engineName, setEngineName] = useState<string | undefined>(undefined)
    const [engine, setEngine] = useState<Engine | undefined>(undefined)
    const [engineType, setEngineType] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();

    const uploadPreset = process.env.NEXT_PUBLIC_ENGINE_PRESET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API;
    const user = session?.user.username;

    const openNotificationWithIcon = (type: NotificationType) => {
      api[type]({
        message: 'Something went wrong',
        description:
          'Please check the form and try again.',
        showProgress: true,
        pauseOnHover: true,
      });
    };

    // Check Engine List
    useEffect(() => {
      const fetchData = async () => {
        if (!engineName) return setEngineName(undefined)
  
        const res = await fetch(`/api/engines/checkengine?engineName=${engineName}`, {
          method: 'POST',
        });
        const data = await res.json()
        setEngine(data)
      }

      fetchData()
    }, [engineName])
    
    const {setValue} = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        userName: '',
        engineName: '',
        engineType: '',
        price: 0,
        quantity: 0,
        picture: '',
        description: '',
        // Specification Field
        BorexStroke: undefined, Displacement: undefined, EngineSpeed: undefined, RatedOutput: undefined, MaxOutPut: undefined, LubeOilCapacity: undefined,
        FuelTankCapacity: undefined, FuelConsumption: undefined, Dimension: undefined, NetWeight: undefined, PackageDimension: undefined, GrossWeight: undefined,
        LoadingQty: undefined, RateACOutput: undefined, MaxACOutput: undefined, Noise: undefined, StartingSystem: undefined, Frequency: undefined,PowerFactor: undefined,
        EngineModel: undefined, DCOutput: undefined, Voltage: undefined, Inlet: undefined, MaxCapacity: undefined, MaxDischarge: undefined, SelfPrimingTime: undefined,
        MaxSuctionHead: undefined, Kw3600: undefined, Kw3000: undefined, Kw2600: undefined, MaxNetTorque: undefined, CompressionRatio: undefined, IdleSpeed: undefined,
        EngineOilCapacity: undefined, Size: undefined, ContinuousOpHours: undefined, Type: undefined, RunningTime: undefined, Optional: undefined, NoLoadVoltage: undefined,
        OperatingWelding: undefined, OperatingCurrent: undefined, MaxArcingCurrent: undefined, DutyCycle: undefined, EngineRatedPower: undefined, TillingWidth: undefined,
        TransmissionMode: undefined, PackingSize: undefined, TillingDepth: undefined, ShiftingGears: undefined, TransportingWheel: undefined, TillingBlades: undefined,
        ContLoad20: undefined, ContLoad40: undefined, NetPower: undefined, DisplacementBore: undefined, EngineType: undefined, Weight: undefined
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {

      setLoading(true);
      if (typeof file === "undefined") return;
      if (values.engineName === engine?.engineName) return;

      const formData = new FormData();
  
      formData.append("file", file);
      formData.append('upload_preset', `${uploadPreset}`);
      formData.append('api_key', `${apiKey}`);

      const results = await fetch('https://api.cloudinary.com/v1_1/hnqdnvduj/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json());

      const response = await fetch('/api/addengine',{
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          userName: user,
          engineName: values.engineName,
          engineType: values.engineType,
          price: values.price,
          quantity: values.quantity,
          picture: results.secure_url,
          description: values.description,

          // Specification Values
          BorexStroke: values.BorexStroke, Displacement: values.Displacement, EngineSpeed: values.EngineSpeed, RatedOutput: values.RatedOutput,
          MaxOutPut: values.MaxOutPut, LubeOilCapacity: values.LubeOilCapacity, FuelTankCapacity: values.FuelTankCapacity, FuelConsumption: values.FuelConsumption,
          Dimension: values.Dimension, NetWeight: values.NetWeight, PackageDimension: values.PackageDimension, GrossWeight: values.GrossWeight, LoadingQty: values.LoadingQty,
          RateACOutput: values.RateACOutput, MaxACOutput: values.MaxACOutput, Noise: values.Noise, StartingSystem: values.StartingSystem, Frequency: values.Frequency,
          PowerFactor: values.PowerFactor, EngineModel: values.EngineModel, DCOutput: values.DCOutput, Voltage: values.Voltage, Inlet: values.Inlet, MaxCapacity: values.MaxCapacity,
          MaxDischarge: values.MaxDischarge, SelfPrimingTime: values.SelfPrimingTime, MaxSuctionHead: values.MaxSuctionHead, Kw3600: values.Kw3600, Kw3000: values.Kw3000,
          Kw2600: values.Kw2600, MaxNetTorque: values.MaxNetTorque, CompressionRatio: values.CompressionRatio, IdleSpeed: values.IdleSpeed, EngineOilCapacity: values.EngineOilCapacity,
          Size: values.Size, ContinuousOpHours: values.ContinuousOpHours, Type: values.Type, RunningTime: values.RunningTime, Optional: values.Optional,
          NoLoadVoltage: values.NoLoadVoltage, OperatingWelding: values.OperatingWelding, OperatingCurrent: values.OperatingCurrent, MaxArcingCurrent: values.MaxArcingCurrent,
          DutyCycle: values.DutyCycle, EngineRatedPower: values.EngineRatedPower, TillingWidth: values.TillingWidth, TransmissionMode: values.TransmissionMode,
          PackingSize: values.PackingSize, TillingDepth: values.TillingDepth, ShiftingGears: values.ShiftingGears, TransportingWheel: values.TransportingWheel,
          TillingBlades: values.TillingBlades, ContLoad20: values.ContLoad20, ContLoad40: values.ContLoad40, NetPower: values.NetPower, DisplacementBore: values.DisplacementBore,
          EngineType: values.EngineType, Weight: values.Weight
          })
      })

      if(response.ok){
          router.push('/engines')
      }
      else {
          openNotificationWithIcon('error');
          setLoading(false);
      }

      };

      const normFile = (e: any) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };  

      const handleBeforeUpload = (file: File) => {
        setFile(file);
        setValue('picture', file.name);
        return false; // Prevent auto upload
      };
      
  return (  
    <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#BB4747',
          colorLink: '#BB4747',
        },
      }}>
    {contextHolder}
    <Form
    labelCol={{ span: 4 }}
    wrapperCol={{ span: 16 }}
    className='flex flex-col md:flex-row max-w-screen-xl mx-auto gap-4 px-2'
    onFinish={onSubmit}
    autoComplete="off"
    requiredMark={false}
    labelAlign='left'
  >
    <Grid>
    <h3 className='text-red-900 font-bold text-lg font-sans pb-8'> Engine Information</h3>
    <Form.Item    
      label="Engine Name"
      name="engineName"
      rules={[{ required: true, message: 'Please input Engine Name' },
        () => ({
          validator(_, value) {
            if (!value) {
              return Promise.resolve();
            }
            if (value.length > 30) {
              return Promise.reject('Maximum Characters Limit Exceeded.');
            }
            if (value === engine?.engineName || value === !undefined) {
              return Promise.reject('Engine already exist');
            }
            else if(value.length < 5 && value.length > 1){
              return Promise.reject('Minimum 5 characters required.');
            }
            return Promise.resolve();
          },

        })
      ]}
    >
      <Input 
        value={engineName}
        onChange={(e) => setEngineName(e.target.value)}
      />
    </Form.Item>

    <Form.Item
      label="Engine Type"
      name="engineType"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Select
      showSearch
      style={{ width: 300 }}
      placeholder="Search to Select"
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
      options={[
        { value: 'Diesel Engine', label: 'Diesel Engine' },
        { value: 'Twin-Cylinder Diesel Engine', label: 'Twin-Cylinder Diesel Engine' },
        { value: 'Open Type Diesel Generator', label: 'Open Type Diesel Generator' },
        { value: 'Silent Diesel Generator', label: 'Silent Diesel Generator' },
        { value: 'Twin-Cylinder Diesel Generator', label: 'Twin-Cylinder Diesel Generator' },
        { value: 'Diesel Water Pump', label: 'Diesel Water Pump' },
        { value: 'Diesel High Pressure Pump', label: 'Diesel High Pressure Pump' },
        { value: 'Diesel Iron Pump', label: 'Diesel Iron Pump' },
        { value: 'Gasoline Engine', label: 'Gasoline Engine' },
        { value: 'Gasoline Twin-Cylinder Engine', label: 'Gasoline Twin-Cylinder Engine' },
        { value: 'Gasoline Twin-Vertical Engine', label: 'Gasoline Twin-Vertical Engine' },
        { value: 'Open Type Gasoline Generator', label: 'Open Type Gasoline Generator' },
        { value: 'Silent Gasoline Generator', label: 'Silent Gasoline Generator' },
        { value: 'Twin-Cylinder Gasoline Generator', label: 'Twin-Cylinder Gasoline Generator' },
        { value: 'Liquified Petroleum Gas & LPT Generator', label: 'Liquified Petroleum Gas & LPT Generator' },
        { value: 'Portable Gasoline Generator', label: 'Portable Gasoline Generator' },
        { value: 'Gasoline Water Pump', label: 'Gasoline Water Pump' },
        { value: 'Gasoline High Pressure Pump', label: 'Gasoline High Pressure Pump' },
        { value: 'Gasoline Iron Pump', label: 'Gasoline Iron Pump' },
        { value: 'Gasoline Trash Pump', label: 'Gasoline Trash Pump' },
        { value: 'Inverter Generator', label: 'Inverter Generator' },
        { value: 'Diesel Welding Generator', label: 'Diesel Welding Generator' },
        { value: 'Gasoline Welding Generator', label: 'Gasoline Welding Generator' },
        { value: 'Tillers', label: 'Tillers' },
        ]}
        value={engineType}
        onChange={(value) => setEngineType(value)}
      />
    </Form.Item>

    <Form.Item
      label="Quantity"
      name="quantity"
      rules={[{ required: true, message: 'Please input Engine Quantity' },
        () => ({
          validator(_, value) {
            if (value > 100) {
              return Promise.reject('Maximum quantity to be added exceeded.');
            }
            return Promise.resolve();
          },

        })
      ]}
    >
      <InputNumber 
      />
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: 'Please input Engine Price' },
        () => ({
          validator(_, value) {
            if (value > 100000) {
              return Promise.reject('Maximum price exceeded.');
            }
            return Promise.resolve();
          },

        })
      ]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input Description' },
        () => ({
          validator(_, value) {
            if (value.length < 10) {
              return Promise.reject('Minimum 10 characters required.');
            }
            else if (value.length > 300) {
              return Promise.reject('Maximum characters limit exceeded.');
            }
            return Promise.resolve();
          },

        })
      ]}
    >
      
      <Input />
    </Form.Item>

    <Form.Item
      name="picture"
      label="Engine Image"
      valuePropName="fileList"
      getValueFromEvent={normFile}
      extra="Upload Engine Image"
      rules={[{ required: true, message: 'Please Upload Engine Image' }]}
    >
      <Upload name="picture" accept='image/*' listType="picture" maxCount={1} beforeUpload={handleBeforeUpload}>
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
    </Form.Item>
    </Grid>
    <Grid>
    <h3 className='text-red-900 font-bold text-lg font-sans pb-8'> Specifications</h3>
    { engineType === 'Diesel Engine' ? <DieselEngine /> :
     engineType === 'Twin-Cylinder Diesel Engine' ? <TwinCylinderDiesel /> :
     engineType === 'Open Type Diesel Generator' ? <DieselGenerator /> :
     engineType === 'Silent Diesel Generator' ? <DieselGenerator /> :
     engineType === 'Twin-Cylinder Diesel Generator' ? <TwinCylinderDieselGenerator /> :
     engineType === 'Diesel Water Pump' ? <DieselWaterPump /> :
     engineType === 'Diesel High Pressure Pump' ? <DieselHighPump /> :
     engineType === 'Diesel Iron Pump' ? <DieselIronPump /> :
     engineType === 'Gasoline Engine' ? <GasolineEngine /> :
     engineType === 'Gasoline Twin-Cylinder Engine' ? <GasolineEngine /> :
     engineType === 'Gasoline Twin-Vertical Engine' ? <GasolineVertical /> :
     engineType === 'Open Type Gasoline Generator' ? <GasolineGenerator /> :
     engineType === 'Silent Gasoline Generator' ? <SilentGasolineGenerator /> :
     engineType === 'Twin-Cylinder Gasoline Generator' ? <TwinCylinderGasolineGenerator /> :
     engineType === 'Liquified Petroleum Gas & LPT Generator' ? <LiquifiedAndLptGenerator /> :
     engineType === 'Portable Gasoline Generator' ? <PortableGasolineGenerator /> :
     engineType === 'Gasoline Water Pump' ? <GasolineWaterPump /> :
     engineType === 'Gasoline High Pressure Pump' ? <GasolineHighPump /> :
     engineType === 'Gasoline Iron Pump' ? <GasolineIronPump /> :
     engineType === 'Gasoline Trash Pump' ? <DieselAndGasolineTrashPump /> :
     engineType === 'Inverter Generator' ? <InverterGenerator /> :
     engineType === 'Diesel Welding Generator' ? <DieselWeldingGenerator /> :
     engineType === 'Gasoline Welding Generator' ? <DieselWeldingGenerator /> :
     engineType === 'Tillers' ? <Tillers />
     : <NoSpecification /> }
    <div className='flex justify-center items-center'>
    <EngineButton>
    {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Add Engine'}
    </EngineButton>
    </div>
    </Grid> 
  </Form>
  </ConfigProvider>
  </>
  )
    }
  export default AddEngineForm;