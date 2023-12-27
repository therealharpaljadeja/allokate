import { gql } from "graphql-request";

export const graphqlEndpoint = "https://alloscan.spec.dev/graphql";

export const checkIfRecipientIsIndexedQuery = gql`
    query checkIfRecipientIsIndexedQuery(
        $chainId: String!
        $poolId: String!
        $recipientId: String!
    ) {
        microGrantRecipient(
            chainId: $chainId
            poolId: $poolId
            recipientId: $recipientId
        ) {
            recipientId
        }
    }
`;

export const checkIfPoolIsIndexedQuery = gql`
    query checkIfPoolIsIndexedQuery($chainId: String!, $poolId: String!) {
        microGrant(chainId: $chainId, poolId: $poolId) {
            poolId
        }
    }
`;

const microGrantsQuery = `
  {
    poolId
    strategy
    allocationStartTime
    allocationEndTime
    approvalThreshold
    maxRequestedAmount
    blockTimestamp
    pool {
      strategy
      strategyName
      tokenMetadata
      token
      amount
      metadataPointer
      profile {
        profileId
        name
      }
    }
  }
`;

export const getActiveMicroGrantsQuery = gql`
  query getActiveMicroGrantsQuery($first: Int!, $offset: Int!) {
    activeMicroGrants(
      orderBy: BLOCK_TIMESTAMP_DESC,
      first: $first,
      offset: $offset,
      condition: {chainId: "421614"}
    )
      ${microGrantsQuery}
  }
`;

export const getUpcomingMicroGrantsQuery = gql`
  query getUpcomingMicroGrantsQuery($first: Int!, $offset: Int!) {
    upcomingMicroGrants(orderBy: BLOCK_TIMESTAMP_DESC, first: $first, offset: $offset, condition: {chainId: "421614"})
      ${microGrantsQuery}
  }
`;

export const getEndedMicroGrantsQuery = gql`
  query getEndedMicroGrantsQuery($first: Int!, $offset: Int!) {
    endedMicroGrants(orderBy: BLOCK_TIMESTAMP_DESC, first: $first, offset: $offset, condition: {chainId: "421614"})
      ${microGrantsQuery}
  }
`;

export const getMicroGrantQuery = gql`
    query getMicroGrantQuery($chainId: String!, $poolId: String!) {
        microGrant(chainId: $chainId, poolId: $poolId) {
            poolId
            chainId
            strategy
            allocationStartTime
            allocationEndTime
            approvalThreshold
            maxRequestedAmount
            blockTimestamp
            pool {
                tokenMetadata
                token
                amount
            }
        }
    }
`;

export const getMicroGrantsRecipientsQuery = gql`
    query getMicroGrantsRecipientsQuery($chainId: String!, $poolId: String!) {
        microGrant(chainId: $chainId, poolId: $poolId) {
            poolId
            chainId
            strategy
            allocationStartTime
            allocationEndTime
            approvalThreshold
            maxRequestedAmount
            blockTimestamp
            useRegistryAnchor
            pool {
                strategy
                strategyName
                tokenMetadata
                token
                amount
                metadataPointer
                profile {
                    profileId
                    name
                }
            }
            allocateds {
                recipientId
                sender
                contractAddress
                contractName
                chainId
                status
                blockTimestamp
                transactionHash
            }
            distributeds {
                recipientId
                recipientAddress
                amount
                sender
                contractName
                contractAddress
                transactionHash
                blockNumber
                blockTimestamp
                chainId
            }
            microGrantRecipients {
                recipientId
                recipientAddress
                requestedAmount
                metadataPointer
                blockTimestamp
                isUsingRegistryAnchor
                status
            }
        }
    }
`;

export const getMicroGrantRecipientQuery = gql`
    query getMicroGrantRecipientQuery(
        $chainId: String!
        $poolId: String!
        $recipientId: String!
    ) {
        microGrantRecipient(
            chainId: $chainId
            poolId: $poolId
            recipientId: $recipientId
        ) {
            recipientId
            sender
            recipientAddress
            requestedAmount
            metadataPointer
            blockTimestamp
            isUsingRegistryAnchor
            status
            microGrant {
                allocationStartTime
                allocationEndTime
                maxRequestedAmount
                blockTimestamp
                poolId
                chainId
                approvalThreshold
                pool {
                    token
                    tokenMetadata
                    strategy
                }
                allocateds {
                    recipientId
                    status
                    sender
                    blockTimestamp
                    transactionHash
                }
                distributeds {
                    recipientId
                    amount
                    sender
                    contractName
                    contractAddress
                    blockTimestamp
                    transactionHash
                }
            }
        }
    }
`;

export const getProfilesByOwnerQuery = gql`
    query getProfilesByOwnerQuery($chainId: String!, $owner: String!) {
        profilesByOwner(chainId: $chainId, owner: $owner) {
            profileId
            name
            owner
            createdAt
            anchor
            metadataPointer
        }
    }
`;

export const getProfileQuery = gql`
    query getProfile($chainId: String!, $profileId: String!) {
        profile(chainId: $chainId, profileId: $profileId) {
            profileId
            nonce
            name
            metadataPointer
            owner
            anchor
            creator
            createdAt
            role {
                roleAccounts {
                    isActive
                    accountId
                }
            }
        }
    }
`;

export const getPoolsByProfileIdQuery = gql`
    query getPoolsByProfileId($profileId: String!) {
        pools(condition: { profileId: $profileId }) {
            poolId
            amount
            metadataPointer
            microGrant {
                allocationStartTime
                allocationEndTime
                approvalThreshold
                maxRequestedAmount
            }
        }
    }
`;

export const getPoolByPoolIdQuery = gql`
    query getPoolByPoolId($poolId: String!) {
        pools(condition: { poolId: $poolId }) {
            poolId
            chainId
            profileId
            strategy
            strategyName
            strategyId
            token
            tokenMetadata
            amount
            metadataPointer
            adminRoleId
            managerRoleId
            profile {
                name
                metadataPointer
                owner
                anchor
            }
            microGrant {
                allocationStartTime
                allocationEndTime
                approvalThreshold
                maxRequestedAmount
                useRegistryAnchor
                microGrantRecipients {
                    strategy
                    recipientAddress
                    requestedAmount
                    isUsingRegistryAnchor
                    status
                    metadataProtocol
                    metadataPointer
                    sender
                    blockHash
                    blockNumber
                    blockTimestamp
                }
            }
        }
    }
`;

export const getMicroGrantRecipientsBySenderQuery = gql`
    query getMicroGrantRecipientsBySenderQuery {
        microGrantRecipients(
            condition: { chainId: "421614" }
            orderBy: BLOCK_TIMESTAMP_DESC
        ) {
            recipientId
            poolId
            sender
            requestedAmount
            status
            blockTimestamp
            metadataPointer
        }
    }
`;

export const getTotalAmountDistributedQuery = gql`
    query getTotalAmountDistributedQuery {
        microGrants(condition: { chainId: "421614" }) {
            distributeds {
                amount
            }
        }
    }
`;

export const getTotalProfilesQuery = gql`
    query getTotalProfilesQuery {
        profiles {
            chainId
        }
    }
`;

export const getAnchors = gql`
    query getAnchors {
        profiles {
            chainId
            anchor
            owner
            role {
                roleAccounts {
                    isActive
                    accountId
                }
            }
        }
    }
`;

export const getProfilesQuery = gql`
    query getProfilesQuery {
        profiles {
            name
            profileId
            chainId
            createdAt
        }
    }
`;
