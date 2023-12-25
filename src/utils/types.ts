import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

export type TStrategyType = keyof typeof StrategyType;

export type TokenMetadata = {
    name: string;
    symbol: string;
    decimals: number;
};

export type TProfileRaw = {
    profileId: `0x${string}`;
    name: string;
    nonce: string;
    owner: `0x${string}`;
    anchor: `0x${string}`;
    metadataPointer: string;
};

export type TApplication = {
    id: number;
    name: string;
    description?: string;
    status: EApplicationStatus;
    base64Image: string;
    recipientAddress: `0x${string}`;
    amountRequested: string;
};

export interface IApplication extends TApplication {
    profileOwner: `0x${string}`;
    nonce: number;
    createdAt: string;
    updatedAt?: string;
}

export type TPoolRaw = {
    poolId: string;
    chainId: string;
    profileId: `0x${string}`;
    strategy: `0x${string}`;
    strategyName: string;
    strategyId: `0x${string}`;
    token: `0x${string}`;
    tokenMetadata: TokenMetadata;
    amount: string;
    metadataPointer: string;
    adminRoleId: string;
    managerRoleId: `0x${string}`;
    profile: TProfileRaw;
    microGrant: TMicroGrantRaw;
};

export type TProfile = {
    recipientId: `0x${string}`;
    recipientAddress: `0x${string}`;
    requestedAmount: string;
    metadataPointer: string;
    isUsingRegistryAnchor: boolean;
    status: string;
};

export type TProfileMetadata = {
    name: string;
    website: string;
    email: string;
    description: string;
};

export type TMicroGrantRecipientByAppIdRaw = {
    recipientId: `0x${string}`;
    sender: `0x${string}`;
    recipientAddress: `0x${string}`;
    requestedAmount: string;
    metadataPointer: string;
    blockTimestamp: string;
    isUsingRegistryAnchor: boolean;
    status: EApplicationStatus;
    microGrant: Pick<
        TMicroGrantRaw,
        | "allocationStartTime"
        | "allocationEndTime"
        | "maxRequestedAmount"
        | "blockTimestamp"
        | "poolId"
        | "approvalThreshold"
    > & {
        pool: Pick<TPoolRaw, "token" | "tokenMetadata" | "strategy">;
        chainId: string;
        allocateds: TAllocatedData[];
        distributeds: TDistributedData[];
    };
};

export type TMicroGrantRecipientByAppIdClientSide = Omit<
    TMicroGrantRecipientByAppIdRaw,
    "metadataPointer"
> & {
    metadata?: TApplicationMetadataClientSide;
    allocateds: TAllocatedData[];
    distributeds: TDistributedData[];
    approvals: TAllocatedData[];
    rejections: TAllocatedData[];
};

export type TApplicationMetadataRaw = {
    name: string;
    website: string;
    description: string;
    email: string;
    base64Image: string;
};

export type TApplicationMetadataClientSide = Omit<
    TApplicationMetadataRaw,
    "base64Image"
> & { image?: { data: string } };

// From API
export type TPoolMetadataRaw = {
    profileId: `0x${string}`;
    name: string;
    website: string;
    description: string;
    base64Image?: string;
};

// To be consumed by frontend
export type TPoolMetadataClientSide = {
    profileId: `0x${string}`;
    name: string;
    website: string;
    description: string;
    image?: { data: string };
};

export type TMicroGrantRecipientRaw = {
    recipientId: `0x${string}`;
    poolId: `0x${string}`;
    sender: `0x${string}`;
    requestedAmount: string;
    status: EApplicationStatus;
    blockTimestamp: string;
    metadataPointer: string;
};

export type TMicroGrantRecipientClientSide = Omit<
    TMicroGrantRecipientRaw,
    "metadataPointer"
> & { metadata: TApplicationMetadataClientSide };

export type TNewPool = TPoolMetadataRaw & {
    // chain info
    tokenAddress: `0x${string}`;
    fundPoolAmount: string;
    maxAmount: string;
    managers: `0x${string}`[];
    startDate: string;
    endDate: string;
    approvalThreshold: number;
    useRegistryAnchor: boolean;
    profileName?: string;
    strategyType: TStrategyType;
    // Hat
    hatId?: number;
    // Gov
    gov?: string;
    minVotePower?: string;
    snapshotReference?: string;
};

export type TNewPoolResponse = {
    address: `0x${string}`;
    poolId: number;
};

export type TApplicationData = {
    microGrant: {
        chainId: string;
        poolId: string;
        allocationStartTime: number;
        allocationEndTime: number;
        maxRequestedAmount: string;
        blockTimestamp: string;
        pool: {
            strategy: string;
            tokenMetadata: {
                name?: string;
                symbol?: string;
                decimals?: number;
            };
            token: `0x${string}`;
            amount: string;
        };
        allocateds: TAllocatedData[];
        distributeds: TDistributedData[];
    };
    sender: string;
    recipientId: string;
    recipientAddress: string;
    requestedAmount: string;
    metadataPointer: string;
    blockTimestamp: string;
    isUsingRegistryAnchor: boolean;
    status: string;
};

export type TAllocatedData = {
    recipientId: `0x${string}`;
    recipientAddress: `0x${string}`;
    sender: `0x${string}`;
    contractAddress: `0x${string}`;
    contractName: string;
    chainId: string;
    blockTimestamp: string;
    status: string;
    transactionHash: string;
};

export type TDistributedData = {
    recipientId: `0x${string}`;
    recipientAddress: `0x${string}`;
    sender: `0x${string}`;
    contractAddress: `0x${string}`;
    contractName: string;
    chainId: string;
    amount: string;
    blockTimestamp: string;
    transactionHash: string;
};

export type TGetPoolsByProfileId = {
    poolId: string;
    metadataPointer: string;
    amount: string;
    microGrant: TMicroGrantClientSide;
};

export type TMicroGrantRaw = {
    poolId: string;
    strategy: `0x${string}`;
    allocationStartTime: string;
    allocationEndTime: string;
    approvalThreshold: string;
    maxRequestedAmount: string;
    useRegistryAnchor: boolean;
    blockTimestamp: string;
    pool: TPoolRaw;
};

export type TMicroGrantClientSide = {
    allocationStartTime: string;
    allocationEndTime: string;
    approvalThreshold: string;
    maxRequestedAmount: string;
    useRegistryAnchor?: boolean;
};

export type TPoolClientSide = {
    id: string;
    amount: string;
    profileId?: string;
    strategy?: `0x${string}`;
    strategyName?: string;
    strategyId?: `0x${string}`;
    token?: `0x${string}`;
    tokenMetadata?: TokenMetadata;
    metadataPointer?: string;
    adminRoleId?: string;
    managerRoleId?: `0x${string}`;
    useRegistryAnchor?: boolean;
    profile?: TProfileMetadata;
    microGrant: TMicroGrantClientSide;
    metadata: TPoolMetadataClientSide;
};

// Progress Modal

export enum ETarget {
    NONE = "None",
    IPFS = "IPFS",
    CHAIN = "Blockchain",
    SPEC = "Spec",
    POOL = "Pool",
    ALLO = "Allo",
}

export enum EProgressStatus {
    IS_SUCCESS = "IS_SUCCESS",
    IN_PROGRESS = "IN_PROGRESS",
    NOT_STARTED = "NOT_STARTED",
    IS_ERROR = "IS_ERROR",
}

export type TProgressStep = {
    id?: string;
    content: string;
    target?: string;
    href?: string;
    status: EProgressStatus;
};

export enum EPoolStatus {
    UPCOMING = "Upcoming",
    ACTIVE = "Active",
    ENDED = "Ended",
}

export enum EApplicationStatus {
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
    PENDING = "Pending",
    PAID = "Paid",
}

export type TActivity = {
    id: number;
    status: string;
    prefixText?: string;
    textBold?: string;
    href?: string;
    suffixText?: string;
    date: string;
    dateTime: string;
};

export type TFlyoutOptions = {
    useFlyout: boolean;
    label: string;
    startIndex: number;
};

export type TProfilesByOwnerResponse = {
    profileId: `0x${string}`;
    name: string;
    owner: `0x${string}`;
    createdAt: string;
    anchor: `0x${string}`;
    metadataPointer: string;
    metadata?: { [key: string]: string };
};

export type TProfileResponse = {
    profileId: `0x${string}`;
    nonce: number;
    name: string;
    metadataPointer: string;
    owner: `0x${string}`;
    anchor: `0x${string}`;
    creator: `0x${string}`;
    createdAt: string;
};

export type TProfileClientSide = Omit<TProfileResponse, "metadataPointer"> & {
    metadata: {
        name: string;
        email: string;
        website: string;
        description: string;
    };
};

export type AbiComponent = {
    name: string;
    type: string;
    internalType?: string;
    components?: Array<AbiComponent>;
};

export type AbiItem = {
    type: string; // 'function', 'event', 'constructor', etc.
    name?: string; // Function or event name
    anonymous?: boolean; // true if the function is anonymous
    inputs?: Array<{
        name: string;
        type: string;
        internalType?: string;
        indexed?: boolean;
        components?: Array<AbiComponent>;
    }>; // Function or event parameters
    outputs?: Array<{
        name: string;
        type: string;
        internalType?: string;
        components?: Array<{
            internalType?: string;
            name?: string;
            type?: string;
            components?: Array<{
                internalType?: string;
                name?: string;
                type?: string;
            }>;
        }>;
    }>; // Function outputs
    stateMutability?: "pure" | "view" | "nonpayable" | "payable"; // Function state mutability
};

export type ContractAbi = Array<AbiItem>;
