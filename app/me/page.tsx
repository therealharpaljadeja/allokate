"use client";

import Title from "../components/Title";
import { Tab } from "@headlessui/react";
import CustomTab from "../components/CustomTab";
import Address from "../components/Address";
import Avatar from "../components/Avatar";
import { RootContext } from "../context/RootContext";
import { useContext, useEffect, useState } from "react";
import Text from "../components/Text";
import SideTable from "../components/SideTable";
import Link from "next/link";
import { getPoolsByProfileId } from "@/src/utils/request";
import { TGetPoolsByProfileIdResponse } from "@/src/utils/types";
import PoolsGrid from "../components/PoolsGrid";

export default function Me() {
    const [pools, setPools] = useState<TGetPoolsByProfileIdResponse[] | null>(
        null
    );
    const { profile } = useContext(RootContext);

    useEffect(() => {
        if (profile) {
            (async () => {
                let pools = await getPoolsByProfileId(profile.profileId);
                setPools(pools);
            })();
        }
    }, [profile]);

    if (!profile) return <Text className="text-[24px]">Loading...</Text>;

    let { profileId, anchor, createdAt, metadata, owner } = profile;
    let { name, email, website, description } = metadata;

    let SideTableItems = [
        {
            label: "Name",
            value: name,
        },
        {
            label: "Owner",
            value: <Address inputAddress={owner} />,
        },
        {
            label: "Anchor",
            value: <Address inputAddress={anchor} />,
        },
        {
            label: "Website",
            value: (
                <Link href={website} target="_blank">
                    <Text className="underline">{website}</Text>
                </Link>
            ),
        },
        {
            label: "Email",
            value: (
                <Link href={`mailto:${email}`}>
                    <Text className="underline">{email}</Text>
                </Link>
            ),
        },
    ];

    return (
        <>
            <div className="flex w-full justify-between">
                <div className="flex justify-start w-full space-x-4">
                    <Avatar salt={profileId} />
                    <div className="flex flex-col justify-start space-y-4">
                        <Title className="text-[30px] leading-none">
                            {name}
                        </Title>
                        <Address inputAddress={profileId} />
                        <Text>{description}</Text>
                    </div>
                </div>
                {/* <div>
                    <Button>Edit Profile</Button>
                </div> */}
            </div>
            <div className="w-full grid grid-cols-3 gap-x-6 space-y-[20px]">
                <div className="w-full col-span-2">
                    <Tab.Group>
                        <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                            <CustomTab
                                title="Pools"
                                count={pools ? pools.length : 0}
                            />
                            <CustomTab title="Applications" count={12} />
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                                <PoolsGrid pools={pools} />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className="flex flex-col items-stretch space-y-4">
                    <SideTable title="Profile Details" items={SideTableItems} />
                </div>
            </div>
        </>
    );
}
