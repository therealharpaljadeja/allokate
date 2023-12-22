"use client";
import { Tab } from "@headlessui/react";
import CustomTab from "./CustomTab";
import PoolsGrid from "./PoolsGrid";
import Text from "./Text";
import { TPoolClientSide } from "@/src/utils/types";

type TableProps = {
    activeGrants?: TPoolClientSide[];
    upcomingGrants?: TPoolClientSide[];
    inactiveGrants?: TPoolClientSide[];
};

export default function Table({
    activeGrants,
    upcomingGrants,
    inactiveGrants,
}: TableProps) {
    return (
        <Tab.Group>
            <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                <CustomTab
                    title="Active"
                    count={activeGrants ? activeGrants.length : 0}
                />
                <CustomTab
                    title="Upcoming"
                    count={upcomingGrants ? upcomingGrants.length : 0}
                />
                <CustomTab
                    title="Ended"
                    count={inactiveGrants ? inactiveGrants.length : 0}
                />
            </Tab.List>
            <Tab.Panels className="w-full mt-[20px]">
                <Tab.Panel className="w-full grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
                    {!activeGrants ? (
                        <Text className="font-WorkSans text-[20px]">
                            Loading...
                        </Text>
                    ) : (
                        <PoolsGrid pools={activeGrants} />
                    )}
                </Tab.Panel>
                <Tab.Panel className="w-full grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
                    {!upcomingGrants ? (
                        <Text className="font-WorkSans text-[20px]">
                            Loading...
                        </Text>
                    ) : (
                        <PoolsGrid pools={upcomingGrants} />
                    )}
                </Tab.Panel>
                <Tab.Panel className="w-full grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
                    {!inactiveGrants ? (
                        <Text className="font-WorkSans text-[20px]">
                            Loading...
                        </Text>
                    ) : (
                        <PoolsGrid pools={inactiveGrants} />
                    )}
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
