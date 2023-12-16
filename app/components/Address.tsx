import { useAccount } from "wagmi";
import Text from "./Text";

export default function Address() {
    const { address } = useAccount();

    return (
        <Text className="text-[16px]">{`${address?.slice(
            0,
            5
        )}...${address?.slice(-4)}`}</Text>
    );
}
