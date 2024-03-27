type LayoutProps = {
    children: React.ReactNode;
}   

const Main = ({ children }: LayoutProps) => {
    return(
        <div className="min-h-full flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center">
            {children}
        </main>
        </div>
    )
}

export default Main;