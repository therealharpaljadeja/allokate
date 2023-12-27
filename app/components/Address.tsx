import { useAccount } from "wagmi";
import Text from "./Text";
import Link from "next/link";

type AddressProps = {
    inputAddress?: string;
    noOfCharacters?: number;
};

export function sliceAddress(address: string, sliceBy: number) {
    if (address)
        return `${address.slice(0, sliceBy)}...${address.slice(sliceBy * -1)}`;
}

export default function Address({
    inputAddress,
    noOfCharacters = 5,
}: AddressProps) {
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
                    inputAddress ? inputAddress : (address as string),
                    noOfCharacters
                )}
            </Text>
        </Link>
    );
}
