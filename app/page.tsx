"use client";

import Table from "./components/Table";
import Card from "./components/Card";
import { useEffect, useState } from "react";
import {
    getAllPoolsCount,
    getGrants,
    getTotalAmountDistributed,
    getTotalProfiles,
} from "@/src/utils/request";
import { EPoolStatus, TPoolClientSide } from "@/src/utils/types";

export default function Home() {
    const [activeGrants, setActiveGrants] = useState<
        TPoolClientSide[] | undefined
    >(undefined);

    const [endedMicroGrants, setEndedMicroGrants] = useState<
        TPoolClientSide[] | undefined
    >(undefined);

    const [upcomingGrants, setUpcomingGrants] = useState<
        TPoolClientSide[] | undefined
    >(undefined);

    const [totalAmountDistributed, setTotalAmountDistributed] = useState("0");

    const [totalPools, setTotalPools] = useState<number>(0);
    const [totalProfiles, setTotalProfiles] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const activeGrants = await getGrants(EPoolStatus.ACTIVE);
            setActiveGrants(activeGrants);

            const endedGrants = await getGrants(EPoolStatus.ENDED);
            setEndedMicroGrants(endedGrants);

            const upcomingGrants = await getGrants(EPoolStatus.UPCOMING);
            setUpcomingGrants(upcomingGrants);

            const totalAmountDistributed = await getTotalAmountDistributed();
            setTotalAmountDistributed(totalAmountDistributed.slice(0, 4));

            const totalPools = await getAllPoolsCount();
            setTotalPools(totalPools);

            const totalProfiles = await getTotalProfiles();
            setTotalProfiles(totalProfiles);
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between space-x-[40px]  w-[100%]">
                <Card
                    title="Total pools created"
                    count={totalPools.toString()}
                />
                <Card
                    title="Total funds distributed"
                    count={`${totalAmountDistributed} ETH`}
                />
                <Card
                    title="Total projects registered"
                    count={totalProfiles.toString() ?? "0"}
                />
            </div>
            <div className="flex w-full flex-col space-y-[20px]">
                <h2 className="font-PlayFairDisplay text-[20px]">
                    MicroGrants
                </h2>
                <Table
                    activeGrants={activeGrants}
                    inactiveGrants={endedMicroGrants}
                    upcomingGrants={upcomingGrants}
                />
            </div>
        </>
    );
}
