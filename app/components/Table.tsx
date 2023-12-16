"use client";
import { Tab } from "@headlessui/react";
import PoolCard from "./PoolCard";
import CustomTab from "./CustomTab";

export default function Table() {
    return (
        <Tab.Group>
            <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                <CustomTab title="Active" count={12} />
                <CustomTab title="Ended" count={3} />
            </Tab.List>
            <Tab.Panels className="w-full mt-[20px]">
                <Tab.Panel className="w-full grid grid-cols-3 gap-x-[20px]">
                    <PoolCard
                        title="Jaxcoder Test Pool"
                        shortDescription="Short description about the pool"
                        maxAllocation={2}
                        amount={10}
                        endDate="03/01/2024"
                        imageSrc="/pool_image.png"
                    />
                </Tab.Panel>
                <Tab.Panel>Content 2</Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
