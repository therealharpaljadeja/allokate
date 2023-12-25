import { getApplicationData } from "@/src/utils/request";
import {
    EApplicationStatus,
    TActivity,
    TMicroGrantRecipientByAppIdClientSide,
} from "@/src/utils/types";
import { useContext, useEffect, useState } from "react";
import Text from "./Text";
import Link from "next/link";
import Title from "./Title";
import {
    convertAddressToShortString,
    formatDateDifference,
    getAddressExplorerLink,
    getTxnExplorerLink,
    humanReadableAmount,
    prettyTimestamp,
} from "@/src/utils/common";
import { Preview } from "react-mde";
import ReactMarkdown from "react-markdown";
import { formatEther } from "viem";
import { formatDateAsDDMMYYYY } from "./ApplicationGrid";
import SideTable from "./SideTable";
import ApplicationActivity from "./ApplicationActivity";
import { PoolContext } from "../context/PoolContext";
import { useAccount } from "wagmi";
import Button from "./Button";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import toast from "react-hot-toast";

const statusColorScheme = {
    [EApplicationStatus.ACCEPTED]:
        "text-green-700 bg-green-50 border-2 border-green-600",
    [EApplicationStatus.PENDING]:
        "text-gray-700 bg-gray-50 border-2 border-gray-600",
    [EApplicationStatus.REJECTED]:
        "text-red-600 bg-red-50 border-2 border-color-500",
    [EApplicationStatus.PAID]:
        "text-blue-600 bg-blue-50 border-2 border-color-500",
};

export default function ApplicationOverview({
    poolId,
    appId,
}: {
    poolId: string;
    appId: string;
}) {
    const [application, setApplication] = useState<
        TMicroGrantRecipientByAppIdClientSide | undefined
    >();
    const { isAllocator, allocate } = useContext(PoolContext);
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            let application = await getApplicationData("421614", poolId, appId);
            setApplication(application);
        })();
    }, []);

    if (!application)
        return <Text className="font-WorkSans text-[24px]">Loading...</Text>;

    if (!Object.keys(application).length)
        return (
            <Text className="font-WorkSans text-[24px]">
                No Such Application
            </Text>
        );

    const hasAllocated = application.allocateds.filter(
        (allocated) => allocated.sender.toLowerCase() === address?.toLowerCase()
    ).length;

    const generateActivity = () => {
        const activity: TActivity[] = [];

        const poolCreatedActivity: TActivity = {
            id: 1,
            status: "none",
            textBold: `Pool Id ${application.microGrant.poolId}`,
            href: getAddressExplorerLink(application.microGrant.pool.strategy),
            suffixText: `created`,
            date: formatDateDifference(application.blockTimestamp),
            dateTime: prettyTimestamp(Number(application.blockTimestamp)),
        };

        console.log(application.blockTimestamp);

        const applicationRegisteredActivity: TActivity = {
            id: 2,
            status: "none",
            textBold: convertAddressToShortString(application.recipientId),
            href: "#",
            suffixText: "application submitted",
            date: formatDateDifference(application.blockTimestamp),
            dateTime: prettyTimestamp(Number(application.blockTimestamp)),
        };

        activity.push(poolCreatedActivity, applicationRegisteredActivity);

        // allocation activity
        application.allocateds.forEach((allocated) => {
            const status = allocated.status === "2" ? "Approved" : "Rejected";
            const allocatedActivity: TActivity = {
                id: activity.length,
                status: status,
                textBold: convertAddressToShortString(allocated.sender),
                href: getTxnExplorerLink(allocated.transactionHash),
                suffixText: `${status} the application`,
                date: formatDateDifference(allocated.blockTimestamp),
                dateTime: prettyTimestamp(Number(allocated.blockTimestamp)),
            };
            activity.push(allocatedActivity);
        });

        // distribution activity
        application.distributeds.forEach((distributed) => {
            const distributedActivity: TActivity = {
                id: activity.length,
                status: "Completed",
                textBold: `${humanReadableAmount(
                    distributed.amount,
                    application.microGrant.pool.tokenMetadata.decimals || 18
                )} ETH`,
                href: getTxnExplorerLink(distributed.transactionHash),
                suffixText: `Distributed to ${convertAddressToShortString(
                    application.recipientAddress
                )}`,
                date: formatDateDifference(distributed.blockTimestamp),
                dateTime: prettyTimestamp(Number(distributed.blockTimestamp)),
            };
            activity.push(distributedActivity);
        });

        return activity;
    };

    const onAllocate = async (bool: boolean) => {
        let allocating = toast.loading(bool ? "Approving..." : "Rejecting...");
        setIsLoading(true);
        try {
            const allocation: Allocation = {
                recipientId: application.recipientId as `0x${string}`,
                status: bool ? Status.Accepted : Status.Rejected,
            };

            await allocate(allocation);
            toast.success(bool ? "Approved" : "Rejected", { id: allocating });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { id: allocating });
        } finally {
            setIsLoading(false);
        }
    };

    const SideTableItems = [
        {
            label: "Status",
            value: (
                <div
                    className={`px-2 py-1 ${
                        statusColorScheme[application.status]
                    }`}
                >
                    <Text className="font-WorkSans text-[14px]">
                        {application.status}
                    </Text>
                </div>
            ),
        },
        {
            label: "Amount",
            value: `${formatEther(BigInt(application.requestedAmount))} ETH`,
        },
        {
            label: "Allocation Period",
            value: (
                <Text>
                    {formatDateAsDDMMYYYY(
                        new Date(
                            Number(application.microGrant.allocationStartTime) *
                                1000
                        )
                    )}{" "}
                    -{" "}
                    {formatDateAsDDMMYYYY(
                        new Date(
                            Number(application.microGrant.allocationEndTime) *
                                1000
                        )
                    )}
                </Text>
            ),
        },
        {
            label: "Rejections",
            value: application.rejections.length,
        },
        {
            label: "Approvals",
            value: (
                <Text>
                    {application.approvals.length} /{" "}
                    {application.microGrant.approvalThreshold}
                </Text>
            ),
        },
    ];

    return (
        <div className="flex w-full flex-col space-y-8">
            <div className="w-full flex">
                <img
                    className="w-full"
                    src={application.metadata?.image?.data}
                />
            </div>
            <div className="w-full grid grid-cols-3 gap-x-6">
                <div className="col-span-2 flex flex-col space-y-6">
                    <Title className="text-[30px] italic">
                        {application.metadata?.name}
                    </Title>
                    <div className="flex border border-color-400 p-4 flex-col space-y-4">
                        <div className="grid grid-cols-3 items-start">
                            <Text>Application Id </Text>
                            <Link
                                target="_blank"
                                href={getAddressExplorerLink(
                                    application.recipientId
                                )}
                            >
                                <Text className="col-span-2 underline !font-SpaceMono">
                                    {appId}
                                </Text>
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 items-start">
                            <Text>Recipient Address</Text>
                            <Link
                                target="_blank"
                                href={getAddressExplorerLink(
                                    application.recipientAddress
                                )}
                            >
                                <Text className="col-span-2 underline !font-SpaceMono">
                                    {application.recipientAddress}
                                </Text>
                            </Link>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <Preview
                            minHeight={200}
                            heightUnits="px"
                            markdown=""
                            generateMarkdownPreview={() =>
                                Promise.resolve(
                                    <ReactMarkdown>
                                        {application.metadata?.description}
                                    </ReactMarkdown>
                                )
                            }
                        />
                    </div>
                </div>
                <div className="w-full col-span-1 flex flex-col space-y-6">
                    {isAllocator &&
                        application.status !== "Accepted" &&
                        !hasAllocated && (
                            <div className="mt-5 flex space-x-4 w-full justify-between mb-5">
                                <Button
                                    onClick={() => onAllocate(true)}
                                    isLoading={isLoading}
                                    className="bg-green-700 hover:bg-green-500 w-full font-semibold leading-6 border-none  text-white  px-3 py-2 disabled:text-color-200"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => onAllocate(false)}
                                    isLoading={isLoading}
                                    className="bg-red-700 hover:bg-red-500 w-full  font-semibold leading-6 border-none  text-white  px-3 py-2 disabled:text-color-200"
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
                    {isAllocator && hasAllocated ? (
                        <Button disabled={true}>Response submitted</Button>
                    ) : null}
                    <SideTable
                        title="Application Details"
                        items={SideTableItems}
                    />
                    <SideTable title="Project Members" items={[]} />
                    <ApplicationActivity activity={generateActivity()} />
                </div>
            </div>
        </div>
    );
}
