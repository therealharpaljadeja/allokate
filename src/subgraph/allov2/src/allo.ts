import { PoolCreated as PoolCreatedEvent } from "../generated/Allo/Allo";
import { Pool } from "../generated/schema";

export function handlePoolCreated(event: PoolCreatedEvent): void {
    let id = event.params.poolId;
    let pool = new Pool(id.toString());
    pool.poolId = event.params.poolId;
    pool.profileId = event.params.profileId;

    pool.strategy = event.params.strategy;
    pool.token = event.params.token;
    pool.tokenMetadata = null;
    pool.metadataPointer = event.params.metadata.pointer;
    pool.metadataProtocol = event.params.metadata.protocol;

    pool.createdAt = event.block.timestamp;

    pool.save();
}
