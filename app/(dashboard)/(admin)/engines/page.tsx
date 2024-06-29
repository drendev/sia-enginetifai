import { EngineList } from "@/components/engines/EngineList";
import Link from "next/link";

export default function Engines() {
    return (
        <div className="h-full py-16">
            <Link href="/engines/AddEngines">Add Engines</Link>
            <div>
                <EngineList />
            </div>
        </div>
    )
}