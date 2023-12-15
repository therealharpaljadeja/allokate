"use client";
import { Tab } from "@headlessui/react";
import PoolCard from "./PoolCard";

export default function Table() {
    return (
        <Tab.Group>
            <Tab.List className="w-full flex items-baseline border-b-[2px] border-b-color-100">
                <Tab className="flex outline-none hover:bg-color-100 hover:bg-opacity-10 px-[25px] py-[10px] space-x-[10px] items-center">
                    <span className="font-WorkSans text-[16px]">Active</span>
                    <span className="font-WorkSans text- text-[12px] px-[10px] py-[2px] rounded-[10px] bg-color-400">
                        12
                    </span>
                </Tab>
                <Tab className="flex outline-none hover:bg-color-100 hover:bg-opacity-10 px-[25px] py-[10px] space-x-[10px] items-center">
                    <span className="font-WorkSans text-[16px]">Ended</span>
                    <span className="font-WorkSans text- text-[12px] px-[10px] py-[2px] rounded-[10px] bg-color-400">
                        3
                    </span>
                </Tab>
            </Tab.List>
            <Tab.Panels className="w-full">
                <Tab.Panel className="w-full grid grid-cols-3 gap-x-[20px]">
                    <PoolCard
                        title="Jaxcoder Test Pool"
                        shortDescription="Short description about the pool"
                        maxAllocation={2}
                        amount={10}
                        endDate="03/01/2024"
                        imageSrc="pool_image.png"
                    />
                    {/* 
                    <div className="w-full bg-color-500 space-y-4 flex flex-col">
                        <h4 className="font-WorkSans">Jaxcoder Test Pool</h4>
                        <p className="font-WorkSans">
                            Short description about the pool
                        </p>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-[28px] font-SpaceMono">
                                    2/10 ETH
                                </h3>
                                <p className="font-WorkSans">
                                    Max Allocation / Pool Amount
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-[28px] font-SpaceMono">
                                    03/01/24
                                </h3>
                                <p className="font-WorkSans">End Date</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-color-500 space-y-4 flex flex-col">
                        <h4 className="font-WorkSans">Jaxcoder Test Pool</h4>
                        <p className="font-WorkSans">
                            Short description about the pool
                        </p>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-[28px] font-SpaceMono">
                                    2/10 ETH
                                </h3>
                                <p className="font-WorkSans">
                                    Max Allocation / Pool Amount
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-[28px] font-SpaceMono">
                                    03/01/24
                                </h3>
                                <p className="font-WorkSans">End Date</p>
                            </div>
                        </div>
                    </div> */}
                </Tab.Panel>
                <Tab.Panel>Content 2</Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
