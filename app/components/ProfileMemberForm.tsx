"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ethereumAddressRegExp } from "@/src/utils/common";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Title from "./Title";
import Text from "./Text";
import CustomInput from "./CustomInput";
import Button from "./Button";
import toast from "react-hot-toast";
import { RootContext } from "../context/RootContext";
import { usePublicClient } from "wagmi";

const schema = yup.object().shape({
    members: yup
        .array()
        .of(
            yup
                .string()
                .required("Member Address is required")
                .matches(ethereumAddressRegExp, "Invalid Ethereum address")
        ),
    action: yup.string().required().oneOf(["add", "remove"]),
});

export default function ProfileMemberForm({
    existingMembers,
}: {
    existingMembers?: { isActive: boolean; accountId: `0x${string}` }[];
}) {
    const context = useContext(RootContext);
    const [members, setMembers] = useState<`0x${string}`[] | string[]>([""]);
    const publicClient = usePublicClient();

    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    if (!context) return <Text className="text-[24px]">Loading...</Text>;

    let { addMembers, removeMembers } = context;

    const handleCancel = () => {
        setIsLoading(false);
        setMembers([""]);
        setValue("members", [""]);
    };

    const onHandleSubmit = async (data: any) => {
        setIsLoading(true);
        let updatingMembers = await toast.loading("Updating Members...");

        try {
            let hash;
            if (data.action === "add") {
                hash = await addMembers(data.members);
            } else {
                hash = await removeMembers(data.members);
            }

            if (hash) await publicClient.waitForTransactionReceipt({ hash });
            toast.success("Members set", { id: updatingMembers });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { id: updatingMembers });
        }

        setTimeout(() => {
            handleCancel();
        }, 1000);
    };

    const addMember = () => {
        setMembers((prevMembers) => [...prevMembers, ""]);
    };

    const removeMember = (index: number) => {
        setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
    };

    return (
        <form className="w-full mt-6" onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="space-y-4">
                <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="w-full flex flex-col space-y-4 sm:col-span-6">
                        {existingMembers && existingMembers.length > 0 && (
                            <div className="space-y-4 flex flex-col">
                                <Title className="text-[24px] italic text-color-100">
                                    Existing Members
                                </Title>
                                <div>
                                    {existingMembers &&
                                        existingMembers.map((member) => (
                                            <div className="flex space-x-2 items-center">
                                                <Text className="text-[20px]">
                                                    {member.accountId}
                                                </Text>
                                                <Text className="text-[16px]">
                                                    {member.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Text>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                        <div className="px-4 sm:px-0">
                            <Title className="text-[24px] italic text-color-100">
                                Manage Members
                            </Title>
                        </div>
                        <div className="flex flex-col mt-6">
                            <div className="flex items-between space-x-4 w-full">
                                <div className="flex flex-col justify-end w-full space-y-4">
                                    <Text className="text-[16px]">Action</Text>
                                    <div className="flex flex-col space-y-2 w-full">
                                        <div className="flex items-center space-x-2">
                                            <select
                                                {...register("action")}
                                                className="bg-color-500 px-3 py-2 text-[16px] outline-none border-2 border-color-400 text-color-100 shadow-sm"
                                            >
                                                <option
                                                    id={`option.add`}
                                                    value="add"
                                                >
                                                    Add
                                                </option>
                                                <option
                                                    id={`option.remove`}
                                                    value="remove"
                                                >
                                                    Remove
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 w-full">
                                        <div className="flex flex-col space-y-2 w-full">
                                            <Text className="text-[16px]">
                                                Member Address
                                            </Text>
                                            <div className="flex flex-col space-y-4 w-full">
                                                {members.map(
                                                    (member, index: number) => (
                                                        <div className="flex items-center space-x-2">
                                                            <div
                                                                className={`w-full ${!errors
                                                                    ?.members?.[
                                                                    index
                                                                ]} flex flex-col space-y-2`}
                                                            >
                                                                <CustomInput
                                                                    {...register(
                                                                        `members.${index}`
                                                                    )}
                                                                    type="text"
                                                                    className="w-full"
                                                                    placeholder="0x1234.."
                                                                    name={`members[${index}]`}
                                                                />
                                                                {errors
                                                                    ?.members?.[
                                                                    index
                                                                ] && (
                                                                    <div className="">
                                                                        <div className="w-[300px] px-3 pb-2">
                                                                            <div>
                                                                                <p
                                                                                    className="mt-2 text-sm text-red-600"
                                                                                    id="email-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            ?.members?.[
                                                                                            index
                                                                                        ]
                                                                                            ?.message
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                {index > 0 ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeMember(
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <XMarkIcon
                                                                            width={
                                                                                15
                                                                            }
                                                                        />
                                                                    </button>
                                                                ) : (
                                                                    <span>
                                                                        &nbsp;
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button
                                    className="flex items-center px-3 py-2 text-sm font-semibold text-color-100 shadow-sm  hover:bg-color-400"
                                    type="button"
                                    onClick={addMember}
                                    isLoading={isLoading}
                                >
                                    <PlusIcon width={12} className="mr-2" /> Add
                                    Row
                                </Button>
                                <Button
                                    className="flex items-center px-3 py-2 text-sm font-semibold text-color-100 shadow-sm hover:bg-color-400"
                                    type="button"
                                    isLoading={isLoading}
                                    onClick={() => {
                                        setMembers([""]);
                                        setValue("members", [""]);
                                    }}
                                >
                                    <TrashIcon width={12} className="mr-2" />
                                    Clear
                                </Button>
                            </div>
                            <div className="w-full mt-6 flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    isLoading={isLoading}
                                    className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 border-none  text-white  px-3 py-2 disabled:text-color-200"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="bg-green-700 hover:bg-green-500 px-4 py-2 text-sm font-semibold border-none text-white shadow-sm disabled:text-color-200"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
