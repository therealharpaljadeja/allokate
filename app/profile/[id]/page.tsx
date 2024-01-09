"use client";

import Title from "../../components/Title";
import { Tab } from "@headlessui/react";
import CustomTab from "../../components/CustomTab";
import Address from "../../components/Address";
import Avatar from "../../components/Avatar";
import { useEffect, useState } from "react";
import Text from "../../components/Text";
import SideTable from "../../components/SideTable";
import Link from "next/link";
import {
    getMicroGrantRecipientBySender,
    getPoolsByProfileId,
    getProfileById,
} from "@/src/utils/request";
import {
    TMicroGrantRecipientClientSide,
    TPoolClientSide,
    TProfileClientSide,
} from "@/src/utils/types";
import PoolsGrid from "../../components/PoolsGrid";
import { useAccount, useNetwork } from "wagmi";
import ApplicationGrid from "@/app/components/ApplicationGrid";
import { ProfileAndAddressArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { Registry } from "@allo-team/allo-v2-sdk";
import ProfileMemberForm from "@/app/components/ProfileMemberForm";

export default function Me({ params }: { params: { id: string } }) {
    const [pools, setPools] = useState<TPoolClientSide[] | undefined>(
        undefined
    );
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [applications, setApplications] = useState<
        TMicroGrantRecipientClientSide[] | undefined
    >();

    const [profile, setProfile] = useState<TProfileClientSide>();

    const { chain } = useNetwork();
    const { address } = useAccount();
    let { id } = params;

    useEffect(() => {
        (async () => {
            if (chain) {
                let profile = await getProfileById({
                    chainId: chain?.id.toString(),
                    profileId: id,
                });
                setProfile(profile);

                let registry = new Registry({
                    chain: 421614,
                    rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
                });

                const profileAndAddressArgs: ProfileAndAddressArgs = {
                    profileId: id,
                    account: address as string,
                };
                const isOwner: boolean = await registry.isOwnerOfProfile(
                    profileAndAddressArgs
                );
                setIsProfileOwner(isOwner);
            }
        })();
    }, []);

    useEffect(() => {
        if (profile) {
            (async () => {
                let pools = await getPoolsByProfileId(profile.profileId);
                setPools(pools);

                let applications = await getMicroGrantRecipientBySender(
                    profile.owner
                );
                setApplications(applications);
            })();
        }
    }, [profile]);

    if (!profile) return <Text className="text-[24px]">Loading...</Text>;
    if (!profile.metadata)
        return (
            <Text className="text-[24px]">Couldn't load profile metadata</Text>
        );

    let { profileId, anchor, metadata, owner, role, name } = profile;
    let { email, website, description } = metadata;
    let { roleAccounts } = role;

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
                <Link href={website ?? "#"} target="_blank">
                    <Text className="underline">{website ?? "#"}</Text>
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
                            <CustomTab
                                title="Applications"
                                count={applications ? applications.length : 0}
                            />
                            {isProfileOwner && (
                                <CustomTab title="Manage Profile" />
                            )}
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                                <PoolsGrid pools={pools} />
                            </Tab.Panel>
                            <Tab.Panel className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                                <ApplicationGrid applications={applications} />
                            </Tab.Panel>
                            <Tab.Panel>
                                <ProfileMemberForm
                                    existingMembers={roleAccounts}
                                />
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
