import getProfilesByOwner from "@/src/utils/request";
import { TProfilesByOwnerResponse } from "@/src/utils/types";
import { Registry } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { MemberArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

export type RootContextType = {
    profile: TProfilesByOwnerResponse | null;
    removeMembers: (
        members: `0x${string}`[]
    ) => Promise<`0x${string}` | undefined>;
    addMembers: (
        members: `0x${string}`[]
    ) => Promise<`0x${string}` | undefined>;
} | null;

export const RootContext = React.createContext<RootContextType>(null);

export default function RootContextProvider({ children }: PropsWithChildren) {
    const [profile, setProfile] = useState<TProfilesByOwnerResponse | null>(
        null
    );
    const [registry, setRegistry] = useState(
        new Registry({
            chain: 421614,
            rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
        })
    );

    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: client } = useWalletClient();

    async function addMembers(members: `0x${string}`[]) {
        if (profile && client) {
            const memberArgs: MemberArgs = {
                profileId: profile.profileId,
                members,
            };

            const txData: TransactionData = registry.addMembers(memberArgs);
            try {
                const hash = await client.sendTransaction({
                    data: txData.data,
                    account: address,
                    to: txData.to,
                    value: BigInt(txData.value),
                });

                return hash;
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }
    async function removeMembers(members: `0x${string}`[]) {
        if (profile && client) {
            const memberArgs: MemberArgs = {
                profileId: profile.profileId,
                members,
            };

            const txData: TransactionData = registry.removeMembers(memberArgs);

            const hash = await client.sendTransaction({
                data: txData.data,
                account: address,
                to: txData.to,
                value: BigInt(txData.value),
            });

            return hash;
        }
    }

    useEffect(() => {
        (async () => {
            if (address && chain) {
                const profiles = await getProfilesByOwner({
                    chainId: chain.id.toString(),
                    account: address.toLowerCase(),
                });

                let latestProfile = profiles[profiles.length - 1];

                setProfile(latestProfile);
            }
        })();
    }, [address]);

    return (
        <RootContext.Provider value={{ profile, addMembers, removeMembers }}>
            {children}
        </RootContext.Provider>
    );
}
