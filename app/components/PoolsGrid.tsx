import { TPoolClientSide } from "@/src/utils/types";
import { formatEther } from "viem";
import PoolCard from "./PoolCard";
import Text from "./Text";
import { formatDateAsDDMMYYYY } from "@/src/utils/common";

export default function PoolsGrid({
    pools,
}: {
    pools: TPoolClientSide[] | undefined;
}) {
    if (!pools)
        return (
            <Text className="font-WorkSans text-[20px]">Loading Pools...</Text>
        );

    if (!pools.length)
        return (
            <Text className="font-WorkSans text-[20px]">No Pools Found</Text>
        );

    return (
        <>
            {pools?.map((pool) => (
                <PoolCard
                    key={pool.id}
                    id={pool.id}
                    amount={formatEther(BigInt(pool.amount))}
                    endDate={
                        pool.microGrant
                            ? formatDateAsDDMMYYYY(
                                  new Date(
                                      Number(
                                          pool.microGrant.allocationEndTime
                                      ) * 1000
                                  )
                              )
                            : "0"
                    }
                    imageSrc={
                        pool.metadata && pool.metadata.image
                            ? pool.metadata?.image.data
                            : ""
                    }
                    maxAllocation={
                        pool.microGrant
                            ? formatEther(
                                  BigInt(pool.microGrant.maxRequestedAmount)
                              )
                            : "0"
                    }
                    shortDescription={
                        pool.metadata
                            ? pool.metadata?.description
                            : "No description provided"
                    }
                    title={pool.metadata ? pool.metadata?.name : "No title"}
                />
            ))}
        </>
    );
}
