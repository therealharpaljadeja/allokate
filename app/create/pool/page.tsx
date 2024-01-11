"use client";

import { MicroGrantsABI } from "@/abi/Microgrants";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/CustomInput";
import ImageUpload from "@/app/components/ImageUpload";
import { MarkdownEditor } from "@/app/components/Markdown";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";
import { RootContext } from "@/app/context/RootContext";
import { getIPFSClient } from "@/src/services/ipfs";
import { getEventValues } from "@/src/utils/common";
import { Allo, MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { encodeAbiParameters, parseAbiParameters, parseEther } from "viem";
import { useNetwork, usePublicClient, useWalletClient } from "wagmi";
import { date, number, object, string } from "yup";
import { ALLO_PROXY, rpc } from "@/src/utils/constants";
import { TStrategyType } from "@/src/utils/types";
import {
    abi as MicroGrantsConditionalAbi,
    bytecode as MicroGrantsConditionalBytecode,
} from "@/src/strategies/microGrantsConditional.config";

const createPoolSchema = object({
    name: string().required(),
    website: string().required().url("Must be a valid website address"),
    description: string().required().min(10, "Must be atleast 10 words"),
    fundAmount: string().required(),
    grantAmount: string().required(),
    threshold: number().positive().required(),
    startDate: date().required(),
    endDate: date()
        .required()
        .when(
            "startDate",
            (startDate, schema) =>
                startDate &&
                schema.min(startDate, "End date must be after the start date")
        ),
    requiredToken: string(),
    requiredTokenBalance: string(),
    strategyType: string().required("Mode of managing allocators is required"),
});

export default function CreatePool() {
    const [base64Image, setBase64Image] = useState<string>("");
    const [creatingPool, setCreatingPool] = useState(false);
    const [strategyTypeSelected, setStrategyTypeSelected] = useState<
        typeof StrategyType.MicroGrants | "microGrantsConditional"
    >(StrategyType.MicroGrants as TStrategyType);
    const { chain } = useNetwork();
    const { data: client } = useWalletClient();
    const publicClient = usePublicClient();

    const context = useContext(RootContext);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createPoolSchema),
    });

    if (!context) return <Text className="text-[24px]">Loading...</Text>;

    let { profile } = context;

    if (!profile) return <Text className="text-[24px]">Loading...</Text>;

    let { name, profileId } = profile;

    async function deployStrategy() {
        if (chain) {
            let createStrategyToast = toast.loading("Deploying Strategy");

            let strategy = new MicroGrantsStrategy({
                chain: chain?.id,
                rpc,
            });

            let strategyAddress: string = "0x";
            let deployParams;

            if (strategyTypeSelected == StrategyType.MicroGrants) {
                deployParams = strategy.getDeployParams(
                    StrategyType.MicroGrants
                );
            } else {
                const constructorArgs: `0x${string}` = encodeAbiParameters(
                    parseAbiParameters("address, string"),
                    [ALLO_PROXY, StrategyType.MicroGrants]
                );

                const constructorArgsNo0x = constructorArgs.slice(2);

                deployParams = {
                    abi: MicroGrantsConditionalAbi,
                    bytecode:
                        MicroGrantsConditionalBytecode + constructorArgsNo0x,
                };
            }

            try {
                toast.loading("Waiting for user", { id: createStrategyToast });

                const hash = await client!.deployContract({
                    abi: deployParams.abi,
                    bytecode: deployParams.bytecode as `0x${string}`,
                    args: [],
                });

                toast.loading("Deploying strategy", {
                    id: createStrategyToast,
                });

                const result = await publicClient.waitForTransactionReceipt({
                    hash: hash,
                });

                strategyAddress = result.contractAddress!;
                toast.success("Strategy deployed", { id: createStrategyToast });
                return { strategy, strategyAddress };
            } catch (error) {
                toast.error("Something went wrong", {
                    id: createStrategyToast,
                });
            }
        }
    }

    async function createPool(data: any) {
        setCreatingPool(true);
        let ipfsUploadToast = toast.loading("Uploading Metadata to IPFS");

        // Upload pool metadata to IPFS
        const ipfsClient = getIPFSClient();

        const metadata = {
            profileId: profileId,
            name: data.name,
            website: data.website,
            description: data.description,
            base64Image,
        };

        let imagePointer;
        let pointer;

        try {
            if (
                metadata.base64Image &&
                metadata.base64Image.includes("base64")
            ) {
                imagePointer = await ipfsClient.pinJSON({
                    data: metadata.base64Image,
                });
                metadata.base64Image = imagePointer.IpfsHash;
            }

            pointer = await ipfsClient.pinJSON(metadata);
            toast.success("Metadata uploaded", { id: ipfsUploadToast });
            console.log(pointer);
        } catch (e) {
            toast.error("Something went wrong", { id: ipfsUploadToast });
            console.log("IPFS", e);
            setCreatingPool(false);
        }

        // Deploy Strategy
        if (chain) {
            const allo = new Allo({
                chain: chain?.id,
                rpc,
            });

            let result = await deployStrategy();

            if (result?.strategyAddress) {
                console.log(result);
                let { strategy, strategyAddress } = result;

                let createPoolToast = toast.loading("Creating Pool...");

                // Deploying Pool
                const startDateInSeconds = Math.floor(
                    new Date(data.startDate).getTime() / 1000
                );

                const endDateInSeconds = Math.floor(
                    new Date(data.endDate).getTime() / 1000
                );

                let initStrategyData;

                if (strategyTypeSelected === StrategyType.MicroGrants) {
                    const initParams: any = {
                        useRegistryAnchor: true,
                        allocationStartTime: BigInt(startDateInSeconds),
                        allocationEndTime: BigInt(endDateInSeconds),
                        approvalThreshold: BigInt(data.threshold),
                        maxRequestedAmount: parseEther(data.grantAmount),
                    };

                    initStrategyData = await strategy.getInitializeData(
                        initParams
                    );
                } else {
                    const initParams: any = {
                        useRegistryAnchor: true,
                        allocationStartTime: BigInt(startDateInSeconds),
                        allocationEndTime: BigInt(endDateInSeconds),
                        approvalThreshold: BigInt(data.threshold),
                        maxRequestedAmount: parseEther(data.grantAmount),
                        requiredToken: data.requiredToken,
                        requiredTokenBalance: parseEther(
                            data.requiredTokenBalance
                        ),
                    };

                    const encoded: `0x${string}` = encodeAbiParameters(
                        parseAbiParameters(
                            "bool, uint64, uint64, uint256, uint256, address, uint256"
                        ),
                        [
                            initParams.useRegistryAnchor,
                            initParams.allocationStartTime,
                            initParams.allocationEndTime,
                            initParams.approvalThreshold,
                            initParams.maxRequestedAmount,
                            initParams.requiredToken,
                            initParams.requiredTokenBalance,
                        ]
                    );

                    initStrategyData = encoded;
                }

                let poolCreationData;

                poolCreationData = {
                    profileId: profileId,
                    strategy: strategyAddress,
                    initStrategyData: initStrategyData,
                    token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    amount: parseEther(data.fundAmount),
                    metadata: {
                        protocol: BigInt(1),
                        pointer: pointer.IpfsHash,
                    },
                    managers: [(profile as any).owner as `0x${string}`],
                };

                let createPoolData;

                createPoolData = await allo.createPoolWithCustomStrategy(
                    poolCreationData
                );

                try {
                    toast.loading("Waiting for user...", {
                        id: createPoolToast,
                    });

                    const tx = await client?.sendTransaction({
                        to: createPoolData.to,
                        data: createPoolData.data,
                        value: BigInt(createPoolData.value),
                    });

                    if (tx) {
                        const receipt =
                            await publicClient.waitForTransactionReceipt({
                                hash: tx,
                                confirmations: 2,
                            });

                        toast.loading(
                            "Waiting for transaction confirmation...",
                            {
                                id: createPoolToast,
                            }
                        );

                        const logValues = getEventValues(
                            receipt,
                            MicroGrantsABI,
                            "Initialized"
                        );

                        let poolId = -1;

                        // poolId is a BigInt and we need to parse it to a number
                        if (logValues.poolId) poolId = Number(logValues.poolId);

                        toast.success("Pool Deployed!", {
                            id: createPoolToast,
                        });

                        router.push(`/profile/${profileId}`);
                    }
                } catch (error) {
                    toast.error("Something went wrong", {
                        id: createPoolToast,
                    });
                    setCreatingPool(false);
                }
            }
        }
        setCreatingPool(false);
    }

    const strategyTypes = [
        {
            name: "Manual",
            type: StrategyType.MicroGrants,
        },
        {
            name: "MicroGrantsConditional",
            type: "microGrantsConditional",
        },
    ];

    return (
        <div className="flex flex-col space-y-8 items-start w-full">
            <Title className="text-[20px] italic">Create Pool</Title>
            <form
                onSubmit={handleSubmit(createPool)}
                className="grid grid-cols-2 w-full gap-8"
            >
                <div className="flex w-full flex-col space-y-4">
                    <label>Strategy</label>
                    {/* <Text>Manual MicroGrants</Text> */}
                    {strategyTypes.length > 0 && (
                        <select
                            {...register("strategyType")}
                            id="strategyType"
                            name="strategyType"
                            className="mt-2 bg-transparent block w-full border-2 border-color-400 px-6 py-2.5 text-color-100 sm:text-sm sm:leading-6"
                            defaultValue={strategyTypes[0].type}
                            onChange={(e) =>
                                setStrategyTypeSelected(
                                    e.target.value as TStrategyType
                                )
                            }
                        >
                            {strategyTypes.map((strategyType, index) => (
                                <option
                                    key={strategyType.type}
                                    value={strategyType.type}
                                    selected={index === 0}
                                >
                                    {strategyType.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

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
                        Pool Name
                    </label>
                    <CustomInput
                        {...register("name")}
                        placeholder="Pool Name"
                    />
                    {errors.name && (
                        <Text className="text-red-500">
                            {errors.name.message}
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
                            {errors.website.message}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="description" className="text-[16px]">
                        Description
                    </label>
                    <MarkdownEditor
                        setText={(text) => setValue("description", text)}
                        value={""}
                    />
                    {errors.description && (
                        <Text className="text-red-500">
                            {errors.description.message}
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
                    <label htmlFor="fundAmount" className="text-[16px]">
                        Fund Pool Amount
                    </label>
                    <CustomInput
                        {...register("fundAmount")}
                        placeholder="10 ETH"
                    />
                    {errors.fundAmount && (
                        <Text className="text-red-500">
                            {errors.fundAmount.message}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="grantAmount" className="text-[16px]">
                        Max Grant Amount
                    </label>
                    <CustomInput
                        {...register("grantAmount")}
                        placeholder="10 ETH"
                    />
                    {errors.grantAmount && (
                        <Text className="text-red-500">
                            {errors.grantAmount.message}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="threshold" className="text-[16px]">
                        Approval Threshold
                    </label>
                    <CustomInput {...register("threshold")} placeholder="2" />
                    {errors.threshold && (
                        <Text className="text-red-500">
                            {errors.threshold.message}
                        </Text>
                    )}
                </div>

                <div></div>
                {strategyTypeSelected === "microGrantsConditional" ? (
                    <>
                        <div className="flex w-full flex-col space-y-4">
                            <label
                                htmlFor="requiredTokenAddress"
                                className="text-[16px]"
                            >
                                Required Token Address
                            </label>
                            <input
                                {...register("requiredToken")}
                                className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                                placeholder="0x73fCc55ab7244708A4F81e45A11e840135969e7B"
                            />
                            {errors.requiredTokenAddress && (
                                <Text className="text-red-500">
                                    {errors.requiredTokenAddress.message}
                                </Text>
                            )}
                        </div>

                        <div className="flex w-full flex-col space-y-4">
                            <label
                                htmlFor="requiredTokenBalance"
                                className="text-[16px]"
                            >
                                Required Token Balance
                            </label>
                            <input
                                {...register("requiredTokenBalance")}
                                className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                                placeholder="1"
                            />
                            {errors.requiredTokenBalance && (
                                <Text className="text-red-500">
                                    {errors.requiredTokenBalance.message}
                                </Text>
                            )}
                        </div>
                    </>
                ) : null}

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="startDate" className="text-[16px]">
                        Start Date
                    </label>
                    <input
                        {...register("startDate")}
                        type="datetime-local"
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                        placeholder="https://example.com"
                    />
                    {errors.startDate && (
                        <Text className="text-red-500">
                            {errors.startDate.message}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label htmlFor="endDate" className="text-[16px]">
                        End Date
                    </label>
                    <input
                        {...register("endDate")}
                        type="datetime-local"
                        className="px-4 py-2 bg-color-500 border-2 border-color-400 text-color-100"
                        placeholder="https://example.com"
                    />
                    {errors.endDate && (
                        <Text className="text-red-500">
                            {errors.endDate.message}
                        </Text>
                    )}
                </div>

                <div className="flex w-full flex-col space-y-4">
                    <label className="text-[16px]">
                        Is a registry profile mandatory for applicants?
                    </label>

                    <div className="border-2 text-color-400 border-color-400 px-4 py-2">
                        <Text>Yes</Text>
                    </div>
                </div>

                <div></div>
                <div></div>
                <div className="flex justify-end w-full">
                    <Button isLoading={creatingPool}>Create</Button>
                </div>
            </form>
        </div>
    );
}
