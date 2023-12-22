import { useAccount } from "wagmi";
import Title from "./Title";
import Link from "next/link";
import { RootContext, RootContextType } from "../context/RootContext";
import { useContext } from "react";

export default function UserNavMenu() {
    const { isConnected } = useAccount();
    const context = useContext(RootContext) as RootContextType;

    if (!context) return null;

    if (!isConnected) return null;

    let { profile } = context;

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
            <Link href={`/profile/${profile?.profileId}`}>
                <Title className="hover:underline italic text-[20px]">
                    Dashboard
                </Title>
            </Link>
        </div>
    );
}
