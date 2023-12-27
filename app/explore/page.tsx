"use client";

import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { getProfiles } from "@/src/utils/request";
import { TGetProfilesClientSide } from "@/src/utils/types";
import Text from "../components/Text";
import Avatar from "../components/Avatar";
import Link from "next/link";
import { sliceAddress } from "@/app/components/Address";

export default function Explore() {
    const [profiles, setProfiles] = useState<
        TGetProfilesClientSide[] | undefined
    >();

    useEffect(() => {
        (async () => {
            let profiles = await getProfiles();
            setProfiles(profiles);
        })();
    }, []);

    if (!profiles) return <Text className="text-[24px]">Loading...</Text>;

    return (
        <div className="flex flex-col items-start space-y-6">
            <Title className="text-[20px] italic">Profiles</Title>
            <div className="grid grid-cols-4 gap-4">
                {profiles?.map((profile) => (
                    <div className="flex space-x-2  border-2 border-color-400 p-2">
                        <Avatar salt={profile.profileId} />
                        <div className="flex flex-col space-y-2">
                            <Title className="text-[16px]">
                                {profile.name}
                            </Title>
                            <Link href={`/profile/${profile.profileId}`}>
                                <Text className="underline">
                                    {sliceAddress(profile.profileId, 6)}
                                </Text>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
