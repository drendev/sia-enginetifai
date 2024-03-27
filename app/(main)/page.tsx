import Maintenance from "./@index/maintenance";
import Index from "./@index/page";

export default function Home() {
    const isLoggedIn = false;
    
    if (!isLoggedIn) {
  return (
    <Index />
  );
    }
}
