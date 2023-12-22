import { useAccount } from "wagmi";
import Text from "./Text";
import Link from "next/link";

type AddressProps = {
    inputAddress?: string;
};

export function sliceAddress(address: string) {
    if (address) return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export default function Address({ inputAddress }: AddressProps) {
    const { address } = useAccount();

    return (
        <Link
            href={`https://sepolia.arbiscan.io/address/${
                inputAddress ? inputAddress : address
            }`}
            target="_blank"
        >
            <Text className="text-[16px] underline">
                {sliceAddress(
                    inputAddress ? inputAddress : (address as string)
                )}
            </Text>
        </Link>
    );
}
