"use client";

import { sliceAddress } from "@/app/components/Address";
import ApplicationGrid from "@/app/components/ApplicationGrid";
import Button from "@/app/components/Button";
import CustomTab from "@/app/components/CustomTab";
import SideTable from "@/app/components/SideTable";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";
import { getPoolStatus } from "@/src/utils/common";
import {
    getMicroGrantRecipientsByPoolId,
    getPoolByPoolId,
} from "@/src/utils/request";
import {
    EPoolStatus,
    TMicroGrantRecipientClientSide,
    TPoolClientSide,
} from "@/src/utils/types";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

const statusColorScheme = {
    [EPoolStatus.ACTIVE]:
        "text-green-700 bg-green-50 border-2 border-green-600",
    [EPoolStatus.UPCOMING]: "text-blue-700 bg-blue-50 border-2 border-blue-600",
    [EPoolStatus.ENDED]: "text-gray-600 bg-gray-50 border-2 border-color-500",
};

export default function Pool({ params }: { params: { id: string } }) {
    const [pool, setPool] = useState<TPoolClientSide | null>(null);
    const [recipients, setRecipients] = useState<
        TMicroGrantRecipientClientSide[] | undefined
    >();
    const [poolStatus, setPoolStatus] = useState<EPoolStatus>(
        EPoolStatus.ENDED
    );

    useEffect(() => {
        (async () => {
            let { id } = params;
            let response = await getPoolByPoolId(id);

            setPool(response);
        })();
    }, []);

    useEffect(() => {
        if (pool && Object.keys(pool).length) {
            (async () => {
                let recipients = await getMicroGrantRecipientsByPoolId(pool.id);
                setRecipients(recipients);
            })();

            setPoolStatus(
                getPoolStatus(
                    Number(pool.microGrant.allocationStartTime),
                    Number(pool.microGrant.allocationEndTime)
                )
            );
        }
    }, [pool]);

    if (!pool)
        return <Text className="font-WorkSans text-[24px]">Loading...</Text>;

    if (!Object.keys(pool).length)
        return <Text className="font-WorkSans text-[24px]">No Such pool</Text>;

    const items = [
        {
            label: "Status",
            value: (
                <div className={`px-2 py-1 ${statusColorScheme[poolStatus]}`}>
                    <Text className="font-WorkSans text-[14px]">
                        {poolStatus}
                    </Text>
                </div>
            ),
        },
        {
            label: "Strategy Type",
            value: pool.strategyName,
        },
        {
            label: "Website",
            value: (
                <Link
                    className="underline"
                    target="_blank"
                    href={pool.profile?.website ?? "#"}
                >
                    {pool.profile?.website}
                </Link>
            ),
        },
        {
            label: "Profile Id",
            value: (
                <Link className="underline" href={`/profile/${pool.profileId}`}>
                    {sliceAddress(pool.profileId as `0x${string}`)}
                </Link>
            ),
        },
        {
            label: "Pool Amount",
            value: `${formatEther(BigInt(pool.amount))} ETH`,
        },
        {
            label: "Max Allocation",
            value: `${formatEther(
                BigInt(pool.microGrant.maxRequestedAmount)
            )} ETH`,
        },
        {
            label: "Start Date",
            value: new Date(
                Number(pool.microGrant.allocationStartTime) * 1000
            ).toLocaleString(),
        },
        {
            label: "End Date",
            value: new Date(
                Number(pool.microGrant.allocationEndTime) * 1000
            ).toLocaleString(),
        },
        {
            label: "Threshold",
            value: pool.microGrant.approvalThreshold,
        },
        {
            label: "Applications",
            value: recipients ? recipients.length.toString() : "0",
        },
        {
            label: "Profile Required",
            value: pool.microGrant.useRegistryAnchor ? "Yes" : "No",
        },
    ];

    return (
        <div className="flex w-full flex-col space-y-8">
            <img
                className="h-72"
                src={
                    pool.metadata.image
                        ? pool.metadata.image.data
                        : "/no_image_available.png"
                }
            />
            <div className="w-full grid grid-cols-3 gap-x-6">
                <div className="w-full col-span-2">
                    <Tab.Group>
                        <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                            <CustomTab title="Pool Description" />
                            <CustomTab
                                title="Applications"
                                count={recipients ? recipients.length : 0}
                            />
                        </Tab.List>
                        <Tab.Panels className="mt-4">
                            <Tab.Panel>
                                <div className="flex flex-col space-y-6 items-start">
                                    <Title className="text-[28px] italic">
                                        {pool.metadata.name}
                                    </Title>
                                    <p>{pool.metadata.description}</p>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                                <ApplicationGrid applications={recipients} />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className="flex flex-col items-stretch space-y-4">
                    {poolStatus === EPoolStatus.ACTIVE ? (
                        <Link
                            className="w-full"
                            href={`/pool/${pool.id}/apply`}
                        >
                            <Button className="w-full">Apply</Button>
                        </Link>
                    ) : poolStatus === EPoolStatus.UPCOMING ? (
                        <Button disabled={true}>Coming Soon</Button>
                    ) : (
                        <Button disabled={true}>Pool has closed</Button>
                    )}
                    <SideTable items={items} title="Pool Details" />
                </div>
            </div>
        </div>
    );
}
