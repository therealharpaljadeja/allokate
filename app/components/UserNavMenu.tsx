import { useAccount } from "wagmi";
import Title from "./Title";
import Link from "next/link";

export default function UserNavMenu() {
    const { isConnected } = useAccount();

    if (!isConnected) return null;

    return (
        <div className="flex items-center space-x-4">
            <Link href="/create/pool">
                <Title className="hover:underline italic text-[20px]">
                    Create Pool
                </Title>
            </Link>
            <Link href="/me">
                <Title className="hover:underline italic text-[20px]">
                    Dashboard
                </Title>
            </Link>
        </div>
    );
}
