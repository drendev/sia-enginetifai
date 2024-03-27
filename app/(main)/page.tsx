import Maintenance from "./@index/maintenance";

export default function Home() {
    const isLoggedIn = false;
    
    if (!isLoggedIn) {
  return (
    <Maintenance />
  );
    }
}
