
import Image from 'next/image';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    height: '360px',
    color: '#000',
    lineHeight: '160px',
    textAlign: 'center',
    
  };

  const Services: React.FC = () => (
        <div className="flex flex-col w-96 justify-center relative md:mr-10 bg-gray-primary rounded-full h-full">
            <Carousel autoplay style={contentStyle}>
                <div className="justify-center mt-6">
                <Image className="rounded-lg mx-5 shadow-lg" src={'/example1.png'} width={350} height={250} alt=''/>
                <p className="text-center font-bold text-red-primary">Data Visualization</p>
                </div>
                <div className="justify-center mt-6">
                <Image className="rounded-lg mx-5 shadow-lg" src={'/example1.png'} width={350} height={250} alt=''/>
                <p className="text-center font-bold text-red-primary">Image Recognition</p>
                </div>
                <div className="justify-center mt-6">
                <Image className="rounded-lg mx-5 shadow-lg" src={'/example1.png'} width={350} height={250} alt=''/>
                <p className="text-center font-bold text-red-primary">Delivery Tracking</p>
                </div>
                <div className="justify-center mt-6">
                <Image className="rounded-lg mx-5 shadow-lg" src={'/example1.png'} width={350} height={250} alt=''/>
                <h1 className="text-center font-bold text-red-primary">Secured System</h1>
                </div>
                <div className="justify-center mt-6">
                <Image className="rounded-lg mx-5 shadow-lg" src={'/example1.png'} width={350} height={250} alt=''/>
                <h1 className="text-center font-bold text-red-primary">User-Friendly</h1>
                </div>
            </Carousel>
            </div>
    )
export default Services;