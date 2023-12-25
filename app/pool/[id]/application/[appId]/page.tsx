"use client";

import { PoolContextProvider } from "@/app/context/PoolContext";
import ApplicationOverview from "@/app/components/ApplicationOverview";

export default function Application({
    params,
}: {
    params: { id: string; appId: string };
}) {
    let { appId, id: poolId } = params;

    return (
        <PoolContextProvider poolId={poolId}>
            <ApplicationOverview poolId={poolId} appId={appId} />
        </PoolContextProvider>
    );
}
