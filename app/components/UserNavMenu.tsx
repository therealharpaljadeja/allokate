import { useAccount } from "wagmi";
import Title from "./Title";
import Link from "next/link";
import { RootContext } from "../context/RootContext";
import { useContext } from "react";

export default function UserNavMenu() {
    const { isConnected } = useAccount();
    const { profile } = useContext(RootContext);

    if (!isConnected) return null;

    return (
        <div className="flex items-center space-x-4">
            <Link href="/create/profile">
                {profile ? null : (
                    <Title className="hover:underline italic text-[20px]">
                        Create Profile
                    </Title>
                )}
            </Link>
            <Link href="/create/pool">
                {profile ? (
                    <Title className="hover:underline italic text-[20px]">
                        Create Pool
                    </Title>
                ) : null}
            </Link>
            <Link href="/me">
                <Title className="hover:underline italic text-[20px]">
                    Dashboard
                </Title>
            </Link>
        </div>
    );
}
