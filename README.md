# AlloKate

Grant distribution tool built on Allo Protocol

## Demo Video

// TODO

## Contract Addresses

|                                                               Name                                                               |                                                           Address                                                            |
| :------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|                                              MicroGrant Strategy (Linked to Pool 9)                                              | [0xF2758A600864737360409045A68f8Dd0926Fa276](https://sepolia.arbiscan.io/address/0xf2758a600864737360409045a68f8dd0926fa276) |
| MicroGrant Recipient Anchor (Linked to [Sender](https://sepolia.arbiscan.io/address/0x4fa31dc602a0df18a5e702ee7f623e04cb642342)) | [0xb0f22e9283840043ab2837d8e4cf1d6d372e1b74](https://sepolia.arbiscan.io/address/0xb0f22e9283840043ab2837d8e4cf1d6d372e1b74) |

## Transactions

-   [Pool creation](https://sepolia.arbiscan.io/tx/0xadc20376f04bce434d121c994cfa66751bdb2f003ae92a24526fb3a070202b36)
-   [Register Recipient](https://sepolia.arbiscan.io/tx/0x96d9c080039fa68017c4190c3abb9fceedb4ae8b425c9525a2ca2e9713654547)
-   [Application Approval](https://sepolia.arbiscan.io/tx/0xafb17bbe7d64de4fe0e08f2c6c22e1fa76de3899c62d5d68e772fdca70d08578)
-   [Application Rejection](https://sepolia.arbiscan.io/tx/0xac850b6b9f15ad33e166f3d45b6b9b857cf56363ab22f140336ad3f0ea65f097)
-   [Profile Creation](https://sepolia.arbiscan.io/tx/0x680cd55498c4412625a6ff4973cbb51e4e67b74fe47b74f9cdfec92a53c871af)
-   [Add members to profile](https://sepolia.arbiscan.io/tx/0xeba38c45c788dbe60a576b1dd746481d53955a5cc6fd32db6732c4412759a210)

## Features

-   MicroGrants Commitee Strategy on Arbitrum is supported
-   Pool Activity (creation, registering recipients, rejection, approvals, distribution, etc...)
-   Grant history of the recipient on different chains for the reviewer
-   Manage pool allocators
-   Manage profile managers
-   Explore projects registered in the registry

## PRs made to Allo projects during hackathon

-   https://github.com/allo-protocol/allo-v2-spec/pull/62
-   https://github.com/allo-protocol/allo-v2-spec/pull/59
-   https://github.com/allo-protocol/allo-v2-sdk/pull/27
-   https://github.com/allo-protocol/allo-v2-sdk/pull/28

## Feedback for Allo

-   There is no easy way to get `profileId` that created application on a MicroGrant, my assumption is that since profile is not mandatory this is not a thing. But I would prefer profiles to be mandatory so that we can use a single identifier that can be cross-chain to fetch the history of recipients the profile has created.
-   https://github.com/allo-protocol/allo-v2/issues/446
-   https://github.com/allo-protocol/allo-v2-spec/issues/56
-   https://github.com/allo-protocol/allo-v2/issues/445
-   A better separation between profiles that are individual and group (project/protocol) would be helpful
-   Too many roles, Pool and Strategy are basically the same currently Allo separates them to achieve modularity. Assuming, that a pool will never change the strategy the roles Pool Manager and Strategy Allocator are basically the same so why have so many different roles...
-   It is very difficult to find to get all pools created on Allo and find whether the pool is active or not, since the active or not status is dependent on strategy. For example, MicroGrant pools are active or inactive based on timestamps whereas RFP pools are active or inactive based on the variable in the strategy contract.
-   SDK support for RFPGrants

## How to use

### Clone the repo

```bash
git clone https://github.com/therealharpaljadeja/allokate.git
```

### Install dependencies

```bash
yarn
```

### Get Pinata API key and Gateway URLs and put them into .env file (check .env.example)

### Run the project

```bash
yarn dev
```

## Known bugs

-   Page doesn't automatically refresh on wallet connection change
-   Tabs inside pages are not aware of wallet connection change. For example, if you are on Manage pool tab where you can add pool managers, you might change the wallet to an address that shouldn't have access to it but the page won't reload, technically on-chain it still won't work though.
-   Some profile pages won't load because they might be using an IPFS service which has garbage collected their metadata and hence the page can't parse profile metadata.
-   Many times just refreshing the page should work 😜

## Future Plan

-   Fix Known bugs
-   Add email notification feature or XMTP
    -   Notification when application status changes for recipient and also reviewers
-   Add support for ERC20 tokens
-   Support for more chains
