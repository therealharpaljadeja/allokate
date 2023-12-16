"use client";

import Button from "@/app/components/Button";
import CustomInput from "@/app/components/CustomInput";
import ImageUpload from "@/app/components/ImageUpload";
import { MarkdownEditor } from "@/app/components/Markdown";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";
import { Listbox } from "@headlessui/react";

export default function CreatePool() {
    return (
        <div className="flex flex-col space-y-8 items-start w-full">
            <Title className="text-[20px] italic">Create Pool</Title>
            <div className="grid grid-cols-2 gap-8 w-full ">
                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Strategy</Text>
                    <input
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-300 cursor-not-allowed"
                        value="Manual"
                        disabled={true}
                    />
                </div>

                {/* Placeholder */}
                <div></div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Pool Name</Text>
                    <CustomInput placeholder="Pool Name" />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Website</Text>
                    <CustomInput placeholder="https://example.com" />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Description</Text>
                    <MarkdownEditor setText={() => "Description"} value={""} />
                </div>

                <div></div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Fund Pool Amount</Text>
                    <CustomInput placeholder="10 ETH" />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Max Grant Amount</Text>
                    <CustomInput placeholder="10 ETH" />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Approval Threshold</Text>
                    <CustomInput placeholder="2" />
                </div>

                <div></div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">Start Date</Text>
                    <input
                        type="datetime-local"
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">End Date</Text>
                    <input
                        type="datetime-local"
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <Text className="text-[16px]">
                        Is a registry profile mandatory for applicants?
                    </Text>
                    <input
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <ImageUpload />
                </div>

                <div className="flex w-full">
                    <Button>Create</Button>
                </div>
            </div>
        </div>
    );
}
