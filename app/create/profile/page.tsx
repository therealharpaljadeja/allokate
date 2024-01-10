"use client";

import Button from "@/app/components/Button";
import CustomInput from "@/app/components/CustomInput";
import { MarkdownEditor } from "@/app/components/Markdown";
import Title from "@/app/components/Title";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Registry } from "@allo-team/allo-v2-sdk/";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { getIPFSClient } from "@/src/services/ipfs";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Text from "@/app/components/Text";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chainId, rpc } from "@/src/utils/constants";

const createProfileSchema = object({
    name: string().required(),
    website: string().required().url("Must be a valid website address"),
    email: string().required().email("Must be a valid email address"),
    description: string().required().min(10, "Must be atleast 10 words"),
});

export default function CreateProfile() {
    const { address } = useAccount();
    const { data: client } = useWalletClient();
    const publicClient = usePublicClient();
    const router = useRouter();

    const [creatingProfile, setCreatingProfile] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createProfileSchema),
    });

    async function createProfile(data: any) {
        setCreatingProfile(true);
        let createProfileToast = toast.loading("Creating profile");

        let { name } = data;

        const ipfsClient = getIPFSClient();

        const profileMetadata = data;

        const { IpfsHash } = await ipfsClient.pinJSON(profileMetadata);

        const registry = new Registry({
            chain: chainId,
            rpc,
        });

        if (client) {
            const createProfileArgs: CreateProfileArgs = {
                nonce: Math.floor(Math.random() * 1_000_000),
                name,
                metadata: {
                    protocol: BigInt(1),
                    pointer: IpfsHash,
                },
                owner: address as string,
                members: [],
            };

            const { data, to, value } =
                registry.createProfile(createProfileArgs);

            toast.loading("Waiting for user", { id: createProfileToast });

            try {
                const hash = await client.sendTransaction({
                    data,
                    account: address,
                    to,
                    value: BigInt(value),
                });

                toast.loading("Create Profile transaction submitted", {
                    id: createProfileToast,
                });

                console.log(`Transaction hash: ${hash}`);

                const transaction =
                    await publicClient.waitForTransactionReceipt({
                        hash,
                    });

                if (transaction.status == "success") {
                    toast.success("Profile Created", {
                        id: createProfileToast,
                    });
                } else {
                    toast.error("Something went wrong", {
                        id: createProfileToast,
                    });
                }
                setCreatingProfile(false);
                // Client could be from ethers, viem, etc..
                router.push("/");
            } catch (error) {
                toast.error("Something went wrong", {
                    id: createProfileToast,
                });
                setCreatingProfile(false);
                return;
            }
        }
    }

    return (
        <div className="flex flex-col space-y-8 items-start w-full">
            <Title className="text-[20px] italic">Create Profile</Title>
            <form
                onSubmit={handleSubmit(createProfile)}
                className="w-full grid grid-cols-2 gap-8"
            >
                <div className="flex w-full flex-col space-y-2">
                    <label htmlFor="name">Name</label>
                    <CustomInput
                        {...register("name")}
                        type="text"
                        placeholder="Name"
                        id="name"
                        className={`${errors.name && "border-red-300"}`}
                    />
                    {errors.name && (
                        <Text className="text-red-500">
                            {errors.name.message}
                        </Text>
                    )}
                </div>
                <div className="flex w-full flex-col space-y-2">
                    <label htmlFor="website">Website</label>
                    <CustomInput
                        {...register("website")}
                        type="text"
                        placeholder="https://example.com"
                        id="website"
                        className={`${errors.website && "border-red-300"}`}
                    />
                    {errors.website && (
                        <Text className="text-red-500">
                            {errors.website.message}
                        </Text>
                    )}
                </div>
                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="email">Email</label>
                    <CustomInput
                        {...register("email")}
                        type="email"
                        placeholder="grants@allokate.com"
                        id="email"
                        className={`${errors.email && "border-red-300"}`}
                    />
                    {errors.email && (
                        <Text className="text-red-500">
                            {errors.email.message}
                        </Text>
                    )}
                </div>
                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="description">Description</label>
                    <MarkdownEditor
                        setText={(text) => setValue("description", text)}
                        value={"Short description about you"}
                    />
                    {errors.description && (
                        <Text className="text-red-500">
                            {errors.description.message}
                        </Text>
                    )}
                </div>
                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="owner">Owner</label>
                    <div className="border-2 text-color-400 border-color-400 px-4 py-2">
                        <Text>{address}</Text>
                    </div>
                </div>

                <div></div>
                <div></div>
                <div className="w-full flex justify-end">
                    <Button isLoading={creatingProfile}>Create</Button>
                </div>
            </form>
        </div>
    );
}
