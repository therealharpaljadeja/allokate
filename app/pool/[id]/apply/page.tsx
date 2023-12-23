"use client";

import Button from "@/app/components/Button";
import CustomInput from "@/app/components/CustomInput";
import ImageUpload from "@/app/components/ImageUpload";
import { MarkdownEditor } from "@/app/components/Markdown";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";
import { RootContext } from "@/app/context/RootContext";
import { getIPFSClient } from "@/src/services/ipfs";
import { getPoolByPoolId } from "@/src/utils/request";
import { TPoolClientSide } from "@/src/utils/types";
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { number, object, string } from "yup";

const descriptionPlaceholder = `## What does your project do?

## Team Members & experience

## Milestones and Budget Allocation
`;

export default function Apply({ params }: { params: { id: string } }) {
    const [registerRecipientSchema, setRegisterRecipientSchema] =
        useState<any>();
    const [registeringRecipient, setRegisteringRecipient] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerRecipientSchema as any),
    });

    const [pool, setPool] = useState<TPoolClientSide | null>(null);
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    let { id } = params;

    useEffect(() => {
        (async () => {
            let pool = await getPoolByPoolId(id);
            setPool(pool);
            console.log(pool);
        })();
    }, []);

    useEffect(() => {
        if (pool) {
            const registerRecipientSchema = object({
                name: string().required(),
                website: string()
                    .required()
                    .url("Must be a valid website address"),
                description: string()
                    .required()
                    .min(10, "Must be atleast 10 words"),
                email: string()
                    .email()
                    .required("Email is required to contact"),
                requestAmount: number()
                    .required()
                    .max(
                        Number(
                            formatEther(
                                pool?.microGrant.maxRequestedAmount as any
                            ).toString()
                        ),
                        "Cannot request more than the Max Allocation Amount"
                    )
                    .default(0),
                recipientAddress: string(),
            });

            setRegisterRecipientSchema(registerRecipientSchema as any);
        }
    }, [pool]);

    const [base64Image, setBase64Image] = useState<string>("");
    const context = useContext(RootContext);

    if (!context) return <Text className="text-[24px]">Loading...</Text>;

    let { profile } = context;
    if (!profile) return <Text className="text-[24px]">Loading...</Text>;

    if (!pool) return <Text className="text-[24px]">Loading...</Text>;

    let { profileId, name } = profile;

    async function registerRecipient(data: any) {
        setRegisteringRecipient(true);

        let registeringRecipientToast = toast.loading(
            "Uploading Application data to IPFS"
        );

        if (profile && walletClient && pool) {
            let ipfsClient = await getIPFSClient();

            let imagePointer;

            if (base64Image && base64Image.includes("base64")) {
                imagePointer = await ipfsClient.pinJSON({
                    data: base64Image,
                });
                imagePointer = imagePointer.IpfsHash;
            }

            try {
                let metadataPointer = await ipfsClient.pinJSON({
                    name: data.name,
                    website: data.website,
                    description: data.description,
                    base64Image: imagePointer,
                    profileId: profile?.profileId,
                });

                toast.loading("Registering Recipient", {
                    id: registeringRecipientToast,
                });

                const registerData = {
                    registryAnchor: profile.anchor,
                    recipientAddress: data.recipientAddress,
                    requestedAmount: parseEther(data.requestAmount.toString()),
                    metadata: {
                        protocol: BigInt(1),
                        pointer: metadataPointer.IpfsHash,
                    },
                };

                let strategy = new MicroGrantsStrategy({
                    chain: 421614,
                    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
                    poolId: Number(pool.id),
                });

                const txData = strategy.getRegisterRecipientData(registerData);

                try {
                    toast.loading("Waiting for user", {
                        id: registeringRecipientToast,
                    });

                    const tx = await walletClient.sendTransaction({
                        to: txData.to,
                        data: txData.data,
                        value: BigInt(txData.value),
                    });

                    const receipt =
                        await publicClient.waitForTransactionReceipt({
                            hash: tx,
                        });

                    console.log(receipt);

                    if (receipt.status == "success") {
                        toast.success("Application Submitted", {
                            id: registeringRecipientToast,
                        });
                    } else {
                        toast.error("Error registering recipient", {
                            id: registeringRecipientToast,
                        });
                    }
                } catch (error) {
                    console.log(error);
                    setRegisteringRecipient(false);
                    toast.error("Error registering recipient", {
                        id: registeringRecipientToast,
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("Error uploading data to IPFS", {
                    id: registeringRecipientToast,
                });
                setRegisteringRecipient(false);
            }
        }
        setRegisteringRecipient(false);
    }

    return (
        <div className="flex flex-col space-y-8 items-start w-full">
            <Title className="text-[20px] italic">Apply</Title>
            <form
                onSubmit={handleSubmit(registerRecipient)}
                className="grid grid-cols-2 w-full gap-8"
            >
                {/* Placeholder */}
                <div className="flex w-full flex-col space-y-4">
                    <label>Profile</label>
                    <div className="border-2 text-color-400 border-color-400 px-4 py-2">
                        <Text>{`${name} - ${profileId.slice(
                            0,
                            10
                        )}...${profileId.slice(-10)}`}</Text>
                    </div>
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="name" className="text-[16px]">
                        Project Name
                    </label>
                    <CustomInput
                        {...register("name")}
                        placeholder="Project Name"
                    />
                    {errors.name && (
                        <Text className="text-red-500">
                            {errors.name.message as string}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="website" className="text-[16px]">
                        Website
                    </label>
                    <CustomInput
                        {...register("website")}
                        placeholder="https://example.com"
                    />
                    {errors.website && (
                        <Text className="text-red-500">
                            {errors.website.message as string}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="email" className="text-[16px]">
                        Email
                    </label>
                    <CustomInput
                        {...register("email")}
                        type="email"
                        placeholder="contact@project.com"
                    />
                    {errors.email && (
                        <Text className="text-red-500">
                            {errors.email.message as string}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="description" className="text-[16px]">
                        Description
                    </label>
                    <MarkdownEditor
                        setText={(text) => setValue("description", text)}
                        value={descriptionPlaceholder}
                    />
                    {errors.description && (
                        <Text className="text-red-500">
                            {errors.description.message as string}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <ImageUpload
                        setBase64Image={setBase64Image}
                        previewImage={base64Image || undefined}
                    />
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="requestAmount" className="text-[16px]">
                        Amount to Request
                    </label>
                    <CustomInput
                        {...register("requestAmount")}
                        placeholder="10"
                        defaultValue={0}
                    />
                    <p>
                        Max Amount:{" "}
                        {`${formatEther(
                            pool?.microGrant.maxRequestedAmount as any
                        ).toString()} ETH`}
                    </p>
                    {errors.requestAmount && (
                        <Text className="text-red-500">
                            {errors.requestAmount.message as string}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="recipientAddress" className="text-[16px]">
                        Recipient Address
                    </label>
                    <CustomInput
                        {...register("recipientAddress")}
                        placeholder="0x1133eA7Af70876e64665ecD07C0A0476d09465a1"
                    />
                    {errors.recipientAddress && (
                        <Text className="text-red-500">
                            {errors.recipientAddress.message as string}
                        </Text>
                    )}
                </div>

                <div></div>
                <div className="flex justify-end w-full">
                    <Button isLoading={registeringRecipient}>Apply</Button>
                </div>
            </form>
        </div>
    );
}
