import { Allo, MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import {
    Allocation,
    Recipient,
    SetAllocatorData,
} from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    useAccount,
    useNetwork,
    usePublicClient,
    useWalletClient,
} from "wagmi";

export interface IPoolContextProps {
    // isLoaded: boolean;
    isAllocator: boolean;
    isPoolManager: boolean;
    isRecipient: boolean;
    // strategy?: MicroGrantsStrategy;
    batchSetAllocator: (data: SetAllocatorData[]) => Promise<void>;
    allocate: (data: Allocation) => Promise<void>;
    // steps: TProgressStep[];
}

export const PoolContext = React.createContext<IPoolContextProps>({
    // isLoaded: false,
    isAllocator: false,
    isPoolManager: false,
    isRecipient: false,
    // strategy: undefined,
    batchSetAllocator: async () => {},
    allocate: async () => {},
    // steps: initialSteps,
});

export const PoolContextProvider = (props: {
    poolId: string;
    children: JSX.Element | JSX.Element[];
}) => {
    const [isAllocator, setIsAllocator] = useState(false);
    const [isPoolManager, setIsPoolManager] = useState(false);
    const [isRecipient, setIsRecipient] = useState(false);
    const [strategy, setStrategy] = useState<MicroGrantsStrategy | undefined>(
        undefined
    );
    const router = useRouter();

    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const { data: client } = useWalletClient();
    const publicClient = usePublicClient();

    useEffect(() => {
        const checkAllocator = async () => {
            if (isConnected && address) {
                const allo = new Allo({
                    chain: Number(chain?.id),
                    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
                });

                const _isPoolManager = await allo.isPoolManager(
                    Number(props.poolId),
                    address
                );

                setIsPoolManager(_isPoolManager);

                const strategy = await allo.getStrategy(Number(props.poolId));
                const microGrants = new MicroGrantsStrategy({
                    chain: Number(chain?.id),
                    address: strategy as `0x${string}`,
                    poolId: Number(props.poolId),
                    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
                });

                setStrategy(microGrants);

                try {
                    const _isAllocator = await microGrants.isValidAllocator(
                        address
                    );

                    setIsAllocator(_isAllocator);
                } catch (error) {
                    console.log("Error checking allocator", error);
                }

                const recipient: Recipient = await microGrants.getRecipient(
                    address
                );

                setIsRecipient(recipient.recipientStatus !== 0);
                // setIsLoaded(true);
            }
        };

        checkAllocator();
    }, [chain?.id, props.poolId, address, isConnected]);

    const batchSetAllocator = async (data: SetAllocatorData[]) => {
        if (strategy && client) {
            const txData: TransactionData =
                strategy.getBatchSetAllocatorData(data);

            try {
                const hash = await client.sendTransaction({
                    to: txData.to,
                    data: txData.data,
                    value: BigInt(txData.value),
                });

                await publicClient.waitForTransactionReceipt({
                    hash: hash,
                });
            } catch (e) {
                console.log("Updating Allocators", e);
            }
        }
    };

    const allocate = async (data: Allocation) => {
        if (strategy && client) {
            const txData: TransactionData = strategy.getAllocationData(
                data.recipientId,
                data.status
            );

            try {
                const hash = await client.sendTransaction({
                    to: txData.to,
                    data: txData.data,
                    value: BigInt(txData.value),
                });

                await publicClient.waitForTransactionReceipt({
                    hash: hash,
                });

                setTimeout(() => {
                    router.refresh();
                }, 3000);
            } catch (e) {
                throw new Error(`${e}`);
            }
        }
    };

    return (
        <PoolContext.Provider
            value={{
                // isLoaded,
                isAllocator,
                isPoolManager,
                isRecipient,
                // strategy,
                batchSetAllocator,
                allocate,
                // steps,
            }}
        >
            {props.children}
        </PoolContext.Provider>
    );
};
