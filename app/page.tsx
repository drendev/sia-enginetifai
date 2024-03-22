import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mt-8 text-red-primary">EnginetifAI</h1>
        <p className="text-lg text-center mt-4">
          Start of a journey to create a better world with AI.
        </p>
      </header>
      <footer className="flex flex-col items-center mt-8">
        <p className="text-sm">
          Dev Abi 2024
        </p>
      </footer>
    </main>
  );
}
