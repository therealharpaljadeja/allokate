import {
    TransactionReceipt,
    decodeEventLog,
    keccak256,
    stringToBytes,
} from "viem";
import { AbiItem, AbiComponent, ContractAbi } from "./types";

export const extractLogByEventName = (logs: any[], eventName: string) => {
    return logs.find((log) => log.eventName === eventName);
};

export const getEventValues = (
    receipt: TransactionReceipt,
    abi: ContractAbi,
    eventName: string
): any => {
    const { logs } = receipt;
    const event = abi.filter(
        (item) => item.type === "event" && item.name === eventName
    )[0];

    const eventTopic = getEventTopic(event);

    const log = logs.find(
        (log) => log.topics[0]?.toLowerCase() === eventTopic.toLowerCase()
    );

    const { topics, data } = log as { topics: string[]; data: string };

    const d = decodeEventLog({
        abi: [event as any],
        data: data as `0x${string}`,
        topics: topics as any,
    });

    return d.args;
};

function getEventTopic(event: AbiItem): string {
    const inputTypesString = getInputTypeString(event);
    const eventString = `${event.name}(${inputTypesString})`;
    const eventTopic = keccak256(stringToBytes(eventString));

    return eventTopic;
}

function getInputTypeString(event: AbiItem): string {
    const inputTypes = event.inputs ? flattenInputTypes(event.inputs) : [];
    return inputTypes.join(",");
}

function flattenInputTypes(
    inputs: Array<{
        name: string;
        type: string;
        components?: Array<AbiComponent>;
    }>
): string[] {
    const result: string[] = [];

    for (const input of inputs) {
        if (input.components) {
            const componentsString = flattenInputTypes(input.components).join(
                ","
            );

            result.push(`(${componentsString})`);
        } else {
            result.push(input.type);
        }
    }

    return result;
}
