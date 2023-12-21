"use client";

import Table from "./components/Table";
import Card from "./components/Card";
import { useEffect, useState } from "react";
import { getActiveMicroGrants, getEndedMicroGrants } from "@/src/utils/request";
import { TPoolClientSide } from "@/src/utils/types";

export default function Home() {
    const [activeGrants, setActiveGrants] = useState<
        TPoolClientSide[] | undefined
    >(undefined);

    const [endedMicroGrants, setEndedMicroGrants] = useState<
        TPoolClientSide[] | undefined
    >(undefined);

    const [totalPools, setTotalPools] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const activeGrants = await getActiveMicroGrants();
            setActiveGrants(activeGrants);

            const endedGrants = await getEndedMicroGrants();
            setEndedMicroGrants(endedGrants);

            setTotalPools(activeGrants.length + endedGrants.length);
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between space-x-[40px]  w-[100%]">
                <Card
                    title="Total pools created"
                    count={totalPools.toString()}
                />
                <Card title="Total funds distributed" count="16.9 ETH" />
                <Card title="Total projects registered" count="71" />
            </div>
            <div className="flex w-full flex-col space-y-[20px]">
                <h2 className="font-PlayFairDisplay text-[20px]">Pools</h2>
                <Table
                    activeGrants={activeGrants}
                    inactiveGrants={endedMicroGrants}
                />
            </div>
        </>
    );
}
