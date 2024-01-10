"use client";

// import Error from "@/components/shared/Error";
// import Modal from "../shared/Modal";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ethereumAddressRegExp } from "@/src/utils/common";
import { SetAllocatorData } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { PoolContext } from "@/app/context/PoolContext";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Title from "./Title";
import Text from "./Text";
import CustomInput from "./CustomInput";
import Button from "./Button";
import toast from "react-hot-toast";

const schema = yup.object().shape({
    allocators: yup.array().of(
        yup.object().shape({
            address: yup
                .string()
                .required("Allocator Address is required")
                .matches(ethereumAddressRegExp, "Invalid Ethereum address"),
            action: yup.string().required("Allocator Action is required"),
        })
    ),
});

export default function PoolAllocatorForm() {
    const { batchSetAllocator } = useContext(PoolContext);
    const [allocators, setAllocators] = useState([
        { address: "", action: "true" }, // Initial allocator
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleCancel = () => {
        setIsLoading(false);
        setAllocators([{ address: "", action: "true" }]);
        setValue("allocators", [{ address: "", action: "true" }]);
    };

    const onHandleSubmit = async (data: any) => {
        setIsLoading(true);
        let allocating = await toast.loading("Allocating...");
        const allocatorData: SetAllocatorData[] = data.allocators.map(
            (allocator: any) => ({
                allocatorAddress: allocator.address,
                flag: allocator.action === "true" ? true : false,
            })
        );
        try {
            await batchSetAllocator(allocatorData);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { id: allocating });
        }
        toast.success("Allocators set", { id: allocating });
        setTimeout(() => {
            handleCancel();
        }, 1000);
    };

    const addAllocator = () => {
        setAllocators((prevAllocators) => [
            ...prevAllocators,
            { address: "", action: "true" },
        ]);
    };

    const removeAllocator = (index: number) => {
        setAllocators((prevAllocators) =>
            prevAllocators.filter((_, i) => i !== index)
        );
    };

    return (
        <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="space-y-4">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-6">
                        <div className="px-4 sm:px-0">
                            <Title className="text-[24px] italic text-color-100">
                                Manage Allocators
                            </Title>
                        </div>
                        <div className="flex flex-col mt-6">
                            <div className="flex items-between space-x-4 w-full">
                                <div className="flex flex-col justify-end w-full space-y-4">
                                    <Text className="text-[16px]">
                                        Allocator Address
                                    </Text>
                                    <div className="flex flex-col space-y-2 w-full">
                                        {allocators.map(
                                            (allocator, index: number) => (
                                                <div
                                                    className={`w-full ${!errors
                                                        ?.allocators?.[index]
                                                        ?.address}`}
                                                >
                                                    <CustomInput
                                                        {...register(
                                                            `allocators.${index}.address`
                                                        )}
                                                        type="text"
                                                        className="w-full"
                                                        placeholder="0x1234.."
                                                        name={`allocators[${index}].address`}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col w-full justify-end space-y-4">
                                    <Text className="text-[16px]">Action</Text>
                                    <div className="flex flex-col space-y-2 w-full">
                                        {allocators.map(
                                            (allocator, index: number) => (
                                                <React.Fragment key={index}>
                                                    <div
                                                        key={`fragment-${index}`}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <select
                                                            {...register(
                                                                `allocators.${index}.action`
                                                            )}
                                                            className="bg-color-500 px-3 py-2 text-[16px] outline-none border-2 border-color-400 text-color-100 shadow-sm"
                                                        >
                                                            <option
                                                                id={`option[${index}].true`}
                                                                value="true"
                                                            >
                                                                Add
                                                            </option>
                                                            <option
                                                                id={`option[${index}].false`}
                                                                value="false"
                                                            >
                                                                Remove
                                                            </option>
                                                        </select>
                                                        <div className="">
                                                            {index > 0 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeAllocator(
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
                                                    {errors?.allocators?.[index]
                                                        ?.address && (
                                                        <div className="">
                                                            <div className="w-[300px] px-3 pb-2">
                                                                <div>
                                                                    <p
                                                                        className="mt-2 text-sm text-red-600"
                                                                        id="email-error"
                                                                    >
                                                                        {
                                                                            errors
                                                                                ?.allocators?.[
                                                                                index
                                                                            ]
                                                                                ?.message
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button
                                    className="flex items-center px-3 py-2 text-sm font-semibold text-color-100 shadow-sm  hover:bg-color-400"
                                    type="button"
                                    onClick={addAllocator}
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
                                        setAllocators([
                                            { address: "", action: "true" },
                                        ]);
                                        setValue("allocators", [
                                            { address: "", action: "true" },
                                        ]);
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
