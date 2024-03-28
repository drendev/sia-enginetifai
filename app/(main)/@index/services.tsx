
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
            <Carousel autoplay>
                <div className="justify-center mt-6">
                <Image className="rounded-lg" src={'/example.png'} width={400} height={250} alt=''/>
                <p className="text-center font-bold text-red-primary">Data Visualization</p>
                </div>
                <div>
                <h3 style={contentStyle}>Delivery Tracking</h3>
                </div>
                <div>
                <h3 style={contentStyle}>Image Recognition</h3>
                </div>
                <div>
                <h3 style={contentStyle}>User-Friendly</h3>
                </div>
                <div className='text-center'>
                    Aldren
                </div>
            </Carousel>
            </div>
    )
export default Services;