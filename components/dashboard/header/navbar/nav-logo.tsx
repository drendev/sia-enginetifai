import Image from 'next/image'

export const NavLogo = () => {
    return (
        <div className="flex ml-5 py-3 justify-center">
        <Image className="w-auto md:h-8 h-6 self-center" src="/logo.png" width={60} height={50} alt=""/>
        <h1 className="ml-4 self-center font-bold tracking-wider text-xs md:text-lg text-slate-700">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
        </div>
    )
}