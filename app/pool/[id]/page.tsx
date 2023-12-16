"use client";

import Button from "@/app/components/Button";
import CustomTab from "@/app/components/CustomTab";
import SideTable from "@/app/components/SideTable";
import { Tab } from "@headlessui/react";

const SideTableItems = [
    {
        label: "Status",
        value: "Active",
    },
    {
        label: "Website",
        value: "Active",
    },
];

export default function Pool() {
    return (
        <div className="flex flex-col space-y-8">
            <img src="/pool_image.png" />
            <div className="w-full grid grid-cols-3 gap-x-6">
                <div className="w-full col-span-2">
                    <Tab.Group>
                        <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                            <CustomTab title="Pool Details" />
                            <CustomTab title="Applications" count={12} />
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel></Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className="flex flex-col items-stretch space-y-4">
                    <SideTable title="Pool Details" items={SideTableItems} />
                    <Button>Apply</Button>
                </div>
            </div>
        </div>
    );
}
