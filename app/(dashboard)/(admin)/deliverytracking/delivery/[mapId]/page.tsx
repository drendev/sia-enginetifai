    "use client"
    // MapComponent.tsx

    import React, { useState, useEffect } from "react";
    import TransactionHistoryModal from "@/components/dashboard/main/delivery/TransactionHistoryModal"; // Import your modal component
    import MapboxComponent2 from "@/components/dashboard/main/delivery/maplocator";
    import DeliveryTracking from "@/components/dashboard/main/delivery/DeliveryTracking";
    import { PackageInformationCard, TransactionHistoryCard } from "@/components/dashboard/main/delivery/TransactionHistory";
    import { PlusOutlined } from "@ant-design/icons";

    const generateTransactionNumber = (): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let result = "";

    // Generate 4 random letters
    for (let i = 0; i < 4; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return result;
    };

    interface Destination {
        longloc: number;
        latloc: number;
    }

    export default function Page({ params }: { params: { mapId: string } }) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [packages, setPackages] = useState<any>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [engineName, setEngineName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [destination, setDestination] = useState<Destination | null>(null);
    const [place, setPlace] = useState("");
    
    const [transactionHistory, setTransactionHistory] = useState<any[]>([
        {
        trackingNumber: generateTransactionNumber(),
        date: "2024-06-21",
        engineName: "Engine ABC",
        place: "Place A",
        action: "Added",
        },
        {
        trackingNumber: generateTransactionNumber(),
        date: "2024-06-20",
        engineName: "Engine XYZ",
        place: "Place B",
        action: "Removed",
        },
        // Additional mock transaction history items can be added here
    ]);

    // State variables for modal and filters
    const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [engineFilter, setEngineFilter] = useState<string | null>(null);


    const handleAddButtonClick = () => {
        // Generate transaction number when opening the form modal
        const generatedTransactionNumber = generateTransactionNumber();

        // Set initial form values
        setTrackingNumber(generatedTransactionNumber);
        setEngineName("");
        setQuantity("");
        setPlace("");

        setShowAddForm(true); // Open the form modal
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newPackage = {
        trackingNumber,
        departureDate: "2024-06-21",
        arrivalDate: "2024-06-22",
        EngineID: "142002",
        engineName,
        quantity: parseInt(quantity),
        driverName: "kuya roel",
        };

        // Update packages state
        setPackages(newPackage);

        // Update transaction history
        setTransactionHistory((prevHistory) => [
        ...prevHistory,
        {
            trackingNumber,
            date: new Date().toLocaleString(),
            engineName,
            place,
            action: "Added",
        },
        ]);

        // Reset form fields and close modal
        setTrackingNumber("");
        setEngineName("");
        setQuantity("");
        setPlace("");
        setShowAddForm(false);
    };

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch(`/api/delivery/destination?transactionId=${params.mapId}`, {
                method: 'POST',
            });
            const data = await res.json();
            setDestination(data);
        };
        fetchEngineData();
    }, [params.mapId]);

    // Filter and sort transaction history based on selected options
    const filteredAndSortedHistory = transactionHistory
        .filter((item) => !engineFilter || item.engineName === engineFilter)
        .sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        });
    return (
        <div className="flex font-sans bg-red-50 flex-col md:flex-row h-auto md:w-full p-4 pt-20">
        {/* Left Side Content */}
        <div className="flex flex-col md:w-[40rem] w-full">

            {/* Adding New Package Card */}
            <div className="bg-red-primary rounded-lg p-6 shadow-md mb-2 w-full bg-right-bottom bg-contain bg-no-repeat bg-track">
            <div className="flex items-center justify-between p-2 ">
                <div>
                <p className="text-red-100 text-4xl font-sans font-extrabold pb-2">
                    Track Delivery
                </p>
                <h1 className="text-sm text-white dark:text-white pl-1 pb-3">
                    Real-Time Delivery Tracking
                </h1>
                </div>
            </div>
            </div>

            {/* Package Information Card */}
            <PackageInformationCard  
            transactionId={Number(params.mapId)}
            />

            {/* Transaction History Card */}
            <TransactionHistoryCard
            transactionId={Number(params.mapId)}
            />
            
        </div>

        {/* Right Side Content (Map Component) */}
        <div className="md:flex-1 md:ml-4 w-full">
            <MapboxComponent2 
            transactionId={Number(params.mapId)}
            />
            <DeliveryTracking/>
        </div>

        {/* Transaction History Modal */}
        {showTransactionHistoryModal && (
            <TransactionHistoryModal
                isOpen={showTransactionHistoryModal}
                onClose={() => setShowTransactionHistoryModal(false)}
                transactionHistory={filteredAndSortedHistory}
                sortOrder={sortOrder}
                onSortOrderChange={(order) => setSortOrder(order)}
                engineFilter={engineFilter}
                onEngineFilterChange={(engine) => setEngineFilter(engine)}
            />
            )}

        </div>
    );
    };

