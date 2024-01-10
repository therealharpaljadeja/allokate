"use server";

import {
    EPoolStatus,
    TApplicationMetadataRaw,
    TDistributedData,
    TGetPoolsByProfileId,
    TGetProfilesClientSide,
    TMicroGrantRaw,
    TMicroGrantRecipientByAppIdClientSide,
    TMicroGrantRecipientByAppIdRaw,
    TMicroGrantRecipientClientSide,
    TMicroGrantRecipientRaw,
    TPoolClientSide,
    TPoolMetadataClientSide,
    TPoolMetadataRaw,
    TPoolRaw,
    TProfileClientSide,
    TProfileMetadata,
    TProfileResponse,
    TProfilesByOwnerResponse,
} from "@/src/utils/types";
import {
    getActiveMicroGrantsQuery,
    getAllMicroGrantRecipientsBySenderQuery,
    getAllPoolsQuery,
    getAnchors,
    getEndedMicroGrantsQuery,
    getMicroGrantRecipientQuery,
    getMicroGrantRecipientsBySenderQuery,
    getPoolActivityQuery,
    getPoolByPoolIdQuery,
    getPoolsByProfileIdQuery,
    getProfileQuery,
    getProfilesByOwnerQuery,
    getProfilesQuery,
    getTotalAmountDistributedQuery,
    getTotalProfilesQuery,
    getUpcomingMicroGrantsQuery,
    graphqlEndpoint,
} from "./query";
import request from "graphql-request";
import { getIPFSClient } from "@/src/services/ipfs";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import { formatEther } from "viem";

const getProfilesByOwner = async ({
    chainId,
    account,
}: {
    chainId: string;
    account: string | `0x${string}`;
}): Promise<TProfilesByOwnerResponse[]> => {
    const response: {
        profilesByOwner: TProfilesByOwnerResponse[];
    } = await request(graphqlEndpoint, getProfilesByOwnerQuery, {
        chainId: chainId,
        owner: account,
    });

    // filter out old profiles that were created before the new registry where deployed
    const filteredProfiles = response.profilesByOwner.filter(
        (profile) =>
            new Date(profile.createdAt) > new Date("2023-11-02T00:00:00+00:00")
    );

    let ipfsClient = await getIPFSClient();

    for (let i = 0; i < filteredProfiles.length; i++) {
        let profile = filteredProfiles[i];

        let metadata = await ipfsClient.fetchJson(profile.metadataPointer);
        profile.metadata = metadata;
    }

    return filteredProfiles;
};

export const getProfileById = async ({
    chainId,
    profileId,
}: {
    chainId: string;
    profileId: string;
}): Promise<TProfileClientSide> => {
    const {
        profile,
    }: {
        profile: TProfileResponse;
    } = await request(graphqlEndpoint, getProfileQuery, {
        chainId: chainId,
        profileId: profileId,
    });

    let result = {} as TProfileClientSide;

    let metadataPointer = profile.metadataPointer;
    let metadata;
    try {
        let ipfsClient = await getIPFSClient();
        metadata = await ipfsClient.fetchJson(metadataPointer);
    } catch (error) {
        console.log(error);
    }

    result = { ...profile, metadata };

    return result;
};

export default getProfilesByOwner;

export const getApplicationData = async (
    chainId: string,
    poolId: string,
    applicationId: string
): Promise<TMicroGrantRecipientByAppIdClientSide> => {
    try {
        const response: {
            microGrantRecipient: TMicroGrantRecipientByAppIdRaw;
        } = await request(graphqlEndpoint, getMicroGrantRecipientQuery, {
            chainId: chainId,
            poolId: poolId,
            recipientId: applicationId.toLocaleLowerCase(),
        });

        let result = {} as TMicroGrantRecipientByAppIdClientSide;

        const application = response.microGrantRecipient;

        if (application.metadataPointer !== "[object Object]") {
            const ipfsClient = getIPFSClient();

            const metadata: TApplicationMetadataRaw =
                await ipfsClient.fetchJson(application.metadataPointer);

            result.metadata = metadata;

            if (metadata.base64Image) {
                const bannerImage = await ipfsClient.fetchJson(
                    metadata.base64Image
                );

                result.metadata.image = bannerImage;
            }
        }

        result.allocateds = application.microGrant.allocateds.filter(
            (allocated) => allocated.recipientId === applicationId
        );

        result.distributeds = application.microGrant.distributeds.filter(
            (distributed) => distributed.recipientId === applicationId
        );

        result.approvals = result.allocateds.filter(
            (allocated) => allocated.status === Status.Accepted.toString()
        );

        result.rejections = result.allocateds.filter(
            (allocated) => allocated.status === Status.Rejected.toString()
        );

        result = { ...application, ...result };

        return result;
    } catch (error) {
        throw new Error("Error fetching application data");
    }
};

export const getPoolsByProfileId = async (
    profileId: string
): Promise<TPoolClientSide[]> => {
    try {
        const result = [] as TPoolClientSide[];

        const response: { pools: TGetPoolsByProfileId[] } = await request(
            graphqlEndpoint,
            getPoolsByProfileIdQuery,
            {
                profileId,
            }
        );

        let { pools } = response;

        for await (let pool of pools) {
            let { metadataPointer } = pool;

            let ipfsClient = await getIPFSClient();

            let metadata = await ipfsClient.fetchJson(metadataPointer);
            if (metadata.base64Image) {
                let imagePointer = metadata.base64Image;

                let image = await ipfsClient.fetchJson(imagePointer);

                metadata.image = image;
            }

            result.push({ ...pool, metadata, id: pool.poolId });
        }

        return result;
    } catch (error) {
        throw new Error("Error fetching pools by profile Id");
    }
};

export async function getGrants(
    grantStatus: EPoolStatus
): Promise<TPoolClientSide[]> {
    let grants = [] as TMicroGrantRaw[];
    const result = [] as TPoolClientSide[];

    switch (grantStatus) {
        case EPoolStatus.ACTIVE:
            const {
                activeMicroGrants,
            }: { activeMicroGrants: TMicroGrantRaw[] } = await request(
                graphqlEndpoint,
                getActiveMicroGrantsQuery,
                {}
            );

            grants = activeMicroGrants;
            break;
        case EPoolStatus.ENDED:
            const { endedMicroGrants }: { endedMicroGrants: TMicroGrantRaw[] } =
                await request(graphqlEndpoint, getEndedMicroGrantsQuery, {});
            grants = endedMicroGrants;
            break;
        case EPoolStatus.UPCOMING:
            const {
                upcomingMicroGrants,
            }: { upcomingMicroGrants: TMicroGrantRaw[] } = await request(
                graphqlEndpoint,
                getUpcomingMicroGrantsQuery,
                {
                    first: 6,
                    offset: 0,
                }
            );

            grants = upcomingMicroGrants;
            break;
    }

    const ipfsClient = await getIPFSClient();

    for (let i = 0; i < grants.length; i++) {
        let pool = {} as TPoolClientSide;

        pool.id = grants[i].poolId;
        pool.amount = grants[i].pool.amount;

        let metadataPointer = grants[i].pool.metadataPointer;

        let poolMetadata = {} as TPoolMetadataClientSide;

        let metadata: TPoolMetadataRaw = await ipfsClient.fetchJson(
            metadataPointer
        );
        poolMetadata = metadata;

        if (metadata.base64Image && typeof metadata.base64Image == "string") {
            let image = await ipfsClient.fetchJson(metadata.base64Image);
            poolMetadata.image = image;
            pool.metadata = poolMetadata;
        } else if (
            metadata.base64Image &&
            typeof metadata.base64Image == "object"
        ) {
            let image = await ipfsClient.fetchJson(
                metadata.base64Image.IpfsHash
            );
            poolMetadata.image = image;
            pool.metadata = poolMetadata;
        }

        pool.microGrant = {
            allocationEndTime: grants[i].allocationEndTime,
            allocationStartTime: grants[i].allocationStartTime,
            approvalThreshold: grants[i].approvalThreshold,
            maxRequestedAmount: grants[i].maxRequestedAmount,
        };
        result.push(pool);
    }

    return result;
}

export async function getPoolByPoolId(id: string): Promise<TPoolClientSide> {
    let { pools }: { pools: TPoolRaw[] } = await request(
        graphqlEndpoint,
        getPoolByPoolIdQuery,
        {
            poolId: id,
        }
    );

    let poolsOnArbitrum = pools.filter((pool) => pool.chainId === "421614");

    // Getting the result pool
    let pool = poolsOnArbitrum[0];

    let result = {} as TPoolClientSide;

    if (pool) {
        let ipfsClient = await getIPFSClient();

        let { metadataPointer } = pool;

        let poolMetadata: TPoolMetadataRaw = await ipfsClient.fetchJson(
            metadataPointer
        );

        let poolMetadataClient: TPoolMetadataClientSide;

        poolMetadataClient = poolMetadata;

        let imagePointer = poolMetadata.base64Image;

        if (typeof imagePointer === "string") {
            let image = await ipfsClient.fetchJson(imagePointer);
            poolMetadataClient.image = image;
        }

        let profileMetadataPointer = pool.profile.metadataPointer;

        let profileMetadata: TProfileMetadata = await ipfsClient.fetchJson(
            profileMetadataPointer
        );

        result.id = pool.poolId;
        result.amount = pool.amount;
        result.managerRoleId = pool.managerRoleId;
        result.adminRoleId = pool.adminRoleId;
        result.metadata = poolMetadataClient;
        result.microGrant = pool.microGrant;
        result.profile = profileMetadata;
        result.profileId = pool.profileId;
        result.strategy = pool.strategy;
        result.strategyId = pool.strategyId;
        result.strategyName = pool.strategyName;
        result.token = pool.token;
        result.tokenMetadata = pool.tokenMetadata;
    }
    return result;
}

export async function microGrantRecipientsRawToClientSide(
    microGrantRecipients: TMicroGrantRecipientRaw[]
): Promise<TMicroGrantRecipientClientSide[]> {
    let result: TMicroGrantRecipientClientSide[] =
        [] as TMicroGrantRecipientClientSide[];

    let ipfsClient = await getIPFSClient();

    for await (let recipient of microGrantRecipients) {
        let final: TMicroGrantRecipientClientSide =
            {} as TMicroGrantRecipientClientSide;

        let metadataPointer = recipient.metadataPointer;

        if (metadataPointer && metadataPointer !== "[object Object]") {
            let metadata: TApplicationMetadataRaw = await ipfsClient.fetchJson(
                metadataPointer
            );

            final.metadata = metadata;
            if (metadata.base64Image) {
                let imagePointer = metadata.base64Image;

                let image = await ipfsClient.fetchJson(imagePointer);

                final.metadata.image = image;
            }
        }
        // final.blockTimestamp = recipient.blockTimestamp;
        // final.poolId = recipient.poolId;
        // final.recipientId = recipient.recipientId;
        // final.requestedAmount = recipient.requestedAmount;
        // final.sender = recipient.sender;
        // final.status = recipient.status;
        // final.chainId = recipient.chainId;

        final = recipient;

        result.push(final);
    }

    return result;
}

export async function getMicroGrantRecipientsByPoolId(poolId: string) {
    let {
        microGrantRecipients,
    }: { microGrantRecipients: TMicroGrantRecipientRaw[] } = await request(
        graphqlEndpoint,
        getMicroGrantRecipientsBySenderQuery,
        {}
    );

    let filtered = microGrantRecipients.filter(
        (recipient) => recipient.poolId === poolId
    );

    return await microGrantRecipientsRawToClientSide(filtered);
}

export async function getMicroGrantRecipientBySender(
    sender: `0x${string}`
): Promise<TMicroGrantRecipientClientSide[]> {
    let {
        microGrantRecipients,
    }: { microGrantRecipients: TMicroGrantRecipientRaw[] } = await request(
        graphqlEndpoint,
        getMicroGrantRecipientsBySenderQuery,
        {}
    );

    let filtered = microGrantRecipients.filter(
        (recipient) => recipient.sender === sender
    );

    return await microGrantRecipientsRawToClientSide(filtered);
}

export async function getTotalAmountDistributed() {
    let {
        microGrants,
    }: { microGrants: { distributeds: TDistributedData[] }[] } = await request(
        graphqlEndpoint,
        getTotalAmountDistributedQuery,
        {}
    );

    let result = BigInt(0);
    for (let i = 0; i < microGrants.length; i++) {
        microGrants[i].distributeds.forEach((distributed) => {
            result = BigInt(distributed.amount) + result;
        });
    }

    return formatEther(result);
}

export async function getProfiles() {
    let { profiles }: { profiles: TGetProfilesClientSide[] } = await request(
        graphqlEndpoint,
        getProfilesQuery,
        {}
    );

    let profilesOnArbitrumSepolia = profiles.filter(
        (profile) => profile.chainId === "421614"
    );

    return profilesOnArbitrumSepolia.sort((profileA, profileB) =>
        profileA.createdAt > profileB.createdAt ? -1 : 1
    );
}

export async function getTotalProfiles() {
    let { profiles }: { profiles: { chainId: string }[] } = await request(
        graphqlEndpoint,
        getTotalProfilesQuery,
        {}
    );

    let result = profiles.filter(
        (profile) => profile.chainId === "421614"
    ).length;

    return result;
}

export async function getProfileOwnerAndMembersByAnchor(
    anchor: `0x${string}`
): Promise<{ owner: `0x${string}`; members: `0x${string}`[] }> {
    let {
        profiles,
    }: {
        profiles: {
            chainId: string;
            anchor: `0x${string}`;
            owner: `0x${string}`;
            role: {
                roleAccounts: { isActive: boolean; accountId: `0x${string}` }[];
            };
        }[];
    } = await request(graphqlEndpoint, getAnchors, {});

    let profile = profiles.filter(
        (profile) => profile.chainId === "421614" && profile.anchor === anchor
    )[0];

    let memberAccounts = profile.role.roleAccounts.filter(
        (account) => account.isActive
    );

    let members = memberAccounts.map(
        (memberAccount) => memberAccount.accountId
    );

    return {
        owner: profile.owner,
        members,
    };
}

export async function getPoolActivity(poolId: string) {
    let {
        pools,
        microGrantRecipients,
    }: {
        pools: (TPoolRaw & { createdAt: string })[];
        microGrantRecipients: TMicroGrantRecipientRaw[];
    } = await request(graphqlEndpoint, getPoolActivityQuery, {
        poolId,
    });

    let poolOnArbitrum = pools.filter((pool) => pool.chainId === "421614")[0];

    let poolCreatedAt = poolOnArbitrum.createdAt;
    let poolAllocateds;
    let poolAllDistributeds;
    if (poolOnArbitrum.microGrant) {
        poolAllocateds = poolOnArbitrum.microGrant.allocateds;
        poolAllDistributeds = poolOnArbitrum.microGrant.distributeds;
    }

    let recipientRequests = microGrantRecipients.filter(
        (recipient) =>
            recipient.poolId === poolId && recipient.status === "Pending"
    );

    return {
        poolCreatedAt,
        poolAllocateds,
        poolAllDistributeds,
        recipientRequests,
    };
}

export async function getAllMicroGrantRecipientsBySender(
    sender: `0x${string}`
): Promise<TMicroGrantRecipientClientSide[]> {
    let {
        microGrantRecipients,
    }: { microGrantRecipients: TMicroGrantRecipientRaw[] } = await request(
        graphqlEndpoint,
        getAllMicroGrantRecipientsBySenderQuery,
        {}
    );

    let filtered = microGrantRecipients.filter(
        (recipient) => recipient.sender === sender
    );

    return await microGrantRecipientsRawToClientSide(filtered);
}

export async function getAllPoolsCount(): Promise<number> {
    let response: { pools: { chainId: string; poolId: string }[] } =
        await request(graphqlEndpoint, getAllPoolsQuery, {});

    let pools = response.pools;

    let poolsOnArbitrum = pools.filter((pool) => pool.chainId === "421614");

    return poolsOnArbitrum.length;
}
