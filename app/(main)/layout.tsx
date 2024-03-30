type Props = {
    children: React.ReactNode;
    index: React.ReactNode;
}   

const Main = ({ children }: Props) => {
    return(
        <>
            {children}
        </>
    )
}

export default Main;