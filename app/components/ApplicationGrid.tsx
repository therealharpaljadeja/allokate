import { TMicroGrantRecipientClientSide } from "@/src/utils/types";
import { formatEther } from "viem";
import Text from "./Text";
import ApplcationCard from "./ApplicationCard";

export function formatDateAsDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default function ApplicationGrid({
    applications,
}: {
    applications: TMicroGrantRecipientClientSide[] | undefined;
}) {
    if (!applications)
        return (
            <Text className="font-WorkSans text-[20px]">
                Loading Applications...
            </Text>
        );

    if (!applications.length)
        return (
            <Text className="font-WorkSans text-[20px]">
                No Applications Found
            </Text>
        );

    return (
        <>
            {applications?.map((application) => (
                <ApplcationCard
                    key={application.recipientId}
                    id={application.recipientId}
                    requestedAmount={formatEther(
                        BigInt(application.requestedAmount)
                    )}
                    submittedOn={
                        application.blockTimestamp
                            ? formatDateAsDDMMYYYY(
                                  new Date(application.blockTimestamp)
                              )
                            : "0"
                    }
                    imageSrc={
                        application.metadata && application.metadata.image
                            ? application.metadata?.image.data
                            : ""
                    }
                    shortDescription={
                        application.metadata
                            ? `${application.metadata?.description.slice(
                                  0,
                                  20
                              )}...`
                            : "No description provided"
                    }
                    title={
                        application.metadata
                            ? application.metadata?.name
                            : "No title"
                    }
                    status={application.status}
                    poolId={application.poolId}
                />
            ))}
        </>
    );
}
