import Image from "next/image";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24">
      <Image src="/maintenance.svg" width={200} height={200} alt="EnginetifAI" />
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mt-8 text-red-primary">EnginetifAI</h1>
        <p className="text-lg text-center mt-4 text-gray-500 px-3">
          Start of a journey to develop AI powered Inventory Management System.
        </p>
      </header>
      <footer className="flex flex-col content-end mt-8">
        <Image src={"/wave.svg"} width={10000} height={1000} alt="Waves" />
      </footer>
    </main>  
  );
}
