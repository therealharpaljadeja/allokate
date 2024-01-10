import {
    TransactionReceipt,
    decodeEventLog,
    formatUnits,
    keccak256,
    stringToBytes,
} from "viem";
import {
    AbiItem,
    AbiComponent,
    ContractAbi,
    EPoolStatus,
    EApplicationStatus,
} from "./types";

export const extractLogByEventName = (logs: any[], eventName: string) => {
    return logs.find((log) => log.eventName === eventName);
};

export const getAddressExplorerLink = (address: `0x${string}`) => {
    return `https://sepolia.arbiscan.io/address/${address}`;
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

export const getPoolStatus = (
    startDate: number,
    endDate: number
): EPoolStatus => {
    const now = new Date().getTime() / 1000;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) {
        return EPoolStatus.UPCOMING;
    } else if (now > end) {
        return EPoolStatus.ENDED;
    } else {
        return EPoolStatus.ACTIVE;
    }
};

export const formatDateDifference = (dateString: string): string => {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (secondsDifference < 60) {
        return "now";
    } else if (minutesDifference < 60) {
        return `${minutesDifference}m ago`;
    } else if (hoursDifference < 24) {
        return `${hoursDifference}h ago`;
    } else {
        return `${daysDifference}d ago`;
    }
};

export const prettyTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    return `${date.toLocaleDateString()}`;
};

export const convertAddressToShortString = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
};

export const getTxnExplorerLink = (hash: string) => {
    return `https://sepolia.arbiscan.io/tx/${hash}`;
};

export function humanReadableAmount(amount: string, decimals?: number) {
    const amountInUnits = Number(formatUnits(BigInt(amount), decimals || 18));

    for (let i = 5; i <= 15; i++) {
        const formattedValue = amountInUnits.toFixed(i);
        if (Number(formattedValue) !== 0) {
            return formattedValue.replace(/\.?0+$/, ""); // Remove trailing zeros
        }
    }
    return 0;
}

export function formatDateAsDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const statusColorScheme = {
    [EApplicationStatus.ACCEPTED]:
        "text-green-700 bg-green-50 border-2 border-green-600",
    [EApplicationStatus.PENDING]:
        "text-color-700 bg-color-100 border-2 border-color-600",
    [EApplicationStatus.REJECTED]:
        "text-red-600 bg-red-50 border-2 border-color-500",
    [EApplicationStatus.PAID]:
        "text-blue-600 bg-blue-50 border-2 border-color-500",
};

export const ethereumAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
