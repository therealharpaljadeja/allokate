"use server";

import {
    TApplicationData,
    TApplicationMetadata,
    TGetPoolsByProfileId,
    TMicroGrantRaw,
    TPoolClientSide,
    TPoolMetadataClientSide,
    TPoolMetadataRaw,
    TProfileResponse,
    TProfilesByOwnerResponse,
} from "@/src/utils/types";
import {
    getActiveMicroGrantsQuery,
    getEndedMicroGrantsQuery,
    getMicroGrantRecipientQuery,
    getPoolsByProfileIdQuery,
    getProfile,
    getProfilesByOwnerQuery,
    graphqlEndpoint,
} from "./query";
import request from "graphql-request";
import { getIPFSClient } from "@/src/services/ipfs";

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
}): Promise<TProfileResponse> => {
    const response: {
        profile: TProfileResponse;
    } = await request(graphqlEndpoint, getProfile, {
        chainId: chainId,
        profileId: profileId,
    });

    return response.profile;
};

export default getProfilesByOwner;

export const getApplicationData = async (
    chainId: string,
    poolId: string,
    applicationId: string
): Promise<{
    application: TApplicationData;
    metadata: TApplicationMetadata;
    bannerImage: string;
}> => {
    try {
        let banner;

        const response: { microGrantRecipient: TApplicationData } =
            await request(graphqlEndpoint, getMicroGrantRecipientQuery, {
                chainId: chainId,
                poolId: poolId,
                recipientId: applicationId.toLocaleLowerCase(),
            });

        const application = response.microGrantRecipient;

        const ipfsClient = getIPFSClient();

        const metadata: TApplicationMetadata = await ipfsClient.fetchJson(
            application.metadataPointer
        );

        if (!metadata.name)
            metadata.name = `Pool ${application.microGrant.poolId}`;

        try {
            const bannerImage = await ipfsClient.fetchJson(
                metadata.base64Image
            );
            banner = bannerImage!.data ? bannerImage.data : "";
        } catch (error) {
            console.error("unable to load banner");
        }

        return {
            application: application,
            metadata: metadata,
            bannerImage: banner,
        };
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

            let imagePointer = metadata.base64Image;

            let image = await ipfsClient.fetchJson(imagePointer);

            metadata.image = image;

            result.push({ ...pool, metadata, id: pool.poolId });
        }

        return result;
    } catch (error) {
        throw new Error("Error fetching pools by profile Id");
    }
};

export async function getActiveMicroGrants(): Promise<TPoolClientSide[]> {
    const { activeMicroGrants }: { activeMicroGrants: TMicroGrantRaw[] } =
        await request(graphqlEndpoint, getActiveMicroGrantsQuery, {
            first: 6,
            offset: 0,
        });

    let result: TPoolClientSide[] = [];

    const ipfsClient = await getIPFSClient();

    for (let i = 0; i < activeMicroGrants.length; i++) {
        let pool = {} as TPoolClientSide;

        pool.id = activeMicroGrants[i].poolId;
        pool.amount = activeMicroGrants[i].pool.amount;

        let metadataPointer = activeMicroGrants[i].pool.metadataPointer;

        let poolMetadata = {} as TPoolMetadataClientSide;

        let metadata: TPoolMetadataRaw = await ipfsClient.fetchJson(
            metadataPointer
        );

        poolMetadata = metadata;

        if (metadata.base64Image) {
            let image = await ipfsClient.fetchJson(metadata.base64Image);

            poolMetadata.image = image;

            pool.metadata = poolMetadata;
        }

        pool.microGrant = {
            allocationEndTime: activeMicroGrants[i].allocationEndTime,
            allocationStartTime: activeMicroGrants[i].allocationStartTime,
            approvalThreshold: activeMicroGrants[i].approvalThreshold,
            maxRequestedAmount: activeMicroGrants[i].maxRequestedAmount,
        };

        result.push(pool);
    }

    return result;
}

export async function getEndedMicroGrants(): Promise<TPoolClientSide[]> {
    const { endedMicroGrants }: { endedMicroGrants: TMicroGrantRaw[] } =
        await request(graphqlEndpoint, getEndedMicroGrantsQuery, {
            first: 6,
            offset: 0,
        });

    let result: TPoolClientSide[] = [];

    const ipfsClient = await getIPFSClient();

    for (let i = 0; i < endedMicroGrants.length; i++) {
        let pool = {} as TPoolClientSide;

        pool.id = endedMicroGrants[i].poolId;
        pool.amount = endedMicroGrants[i].pool.amount;

        let metadataPointer = endedMicroGrants[i].pool.metadataPointer;

        let poolMetadata = {} as TPoolMetadataClientSide;

        let metadata: TPoolMetadataRaw = await ipfsClient.fetchJson(
            metadataPointer
        );

        poolMetadata = metadata;

        if (metadata.base64Image) {
            let image = await ipfsClient.fetchJson(metadata.base64Image);

            poolMetadata.image = image;
        }

        pool.metadata = poolMetadata;

        pool.microGrant = {
            allocationEndTime: endedMicroGrants[i].allocationEndTime,
            allocationStartTime: endedMicroGrants[i].allocationStartTime,
            approvalThreshold: endedMicroGrants[i].approvalThreshold,
            maxRequestedAmount: endedMicroGrants[i].maxRequestedAmount,
        };

        result.push(pool);
    }

    return result;
}
