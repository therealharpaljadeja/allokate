"use client";

import Title from "../components/Title";
import Button from "../components/Button";
import { Tab } from "@headlessui/react";
import CustomTab from "../components/CustomTab";
import Address from "../components/Address";

export default function Me() {
    return (
        <>
            <div className="flex w-full justify-between">
                <div className="flex justify-start w-full space-x-4">
                    <div className="p-10 bg-color-200" />
                    <div className="flex flex-col justify-start space-y-4">
                        <Title className="text-[30px] leading-none">
                            Your Name
                        </Title>
                        <Address />
                    </div>
                </div>
                <div>
                    <Button>Edit Profile</Button>
                </div>
            </div>
            <div className="flex w-full flex-col space-y-[20px]">
                <div className="w-full col-span-2">
                    <Tab.Group>
                        <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                            <CustomTab title="Pools" count={4} />
                            <CustomTab title="Applications" count={12} />
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel></Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </>
    );
}
