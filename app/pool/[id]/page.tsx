"use client";

import PoolOverview from "@/app/components/PoolOverview";
import { PoolContextProvider } from "@/app/context/PoolContext";

export default function Pool({ params }: { params: { id: string } }) {
    let { id: poolId } = params;

    return (
        <PoolContextProvider poolId={poolId}>
            <PoolOverview poolId={poolId} />
        </PoolContextProvider>
    );
}
