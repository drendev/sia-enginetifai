// pages/index.tsx
import type { NextPage } from 'next';
import Autocomplete from '@/components/delivery/autocomplete';

const Home: NextPage = () => {
  return (
    <div className='pt-16'>
      <h1>Address Autocomplete</h1>
      <Autocomplete />
    </div>
  );
};

export default Home;
