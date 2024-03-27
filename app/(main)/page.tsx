import Maintenance from "./maintenance/page";

export default function Home() {
    const isLoggedIn = false;
    
    if (!isLoggedIn) {
  return (
    <Maintenance />
  );
    }
}
