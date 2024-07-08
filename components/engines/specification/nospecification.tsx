import Image from 'next/image';

export function NoSpecification() {
    return (
        <div className="h-72 flex flex-col justify-center items-center">
            <Image src="/entertype.svg" alt="Enter Type" width={200} height={200} />
            <h3 className="mt-4 text-lg font-sans font-semibold text-red-900">Engine Type Missing</h3>
        </div>
    );
}
