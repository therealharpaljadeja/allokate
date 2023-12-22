import getProfilesByOwner from "@/src/utils/request";
import { TProfilesByOwnerResponse } from "@/src/utils/types";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

export type RootContextType = {
    profile: TProfilesByOwnerResponse | null;
} | null;

export const RootContext = React.createContext<RootContextType>(null);

export default function RootContextProvider({ children }: PropsWithChildren) {
    const [profile, setProfile] = useState<TProfilesByOwnerResponse | null>(
        null
    );

    const { address } = useAccount();
    const { chain } = useNetwork();

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
    }, []);

    return (
        <RootContext.Provider value={{ profile }}>
            {children}
        </RootContext.Provider>
    );
}
