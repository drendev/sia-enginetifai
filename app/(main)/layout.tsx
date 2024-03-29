type Props = {
    children: React.ReactNode;
    index: React.ReactNode;
}   

const Main = ({ children }: Props) => {
    return(
        <div className="min-h-full min-w-full flex flex-col bg-waves bg-no-repeat bg-cover">
        <main className="flex-1 flex flex-col items-center justify-center">
            {children}
        </main>
        </div>
    )
}

export default Main;