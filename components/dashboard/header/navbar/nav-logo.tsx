import Image from 'next/image'

export const NavLogo = () => {
    return (
        <div className="flex ml-5 py-3">
        <Image className="w-auto h-auto" src="/logo.png" width={60} height={50} alt=""/>
        <h1 className="ml-4 self-center font-bold tracking-wider text-lg">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
        </div>
    )
}