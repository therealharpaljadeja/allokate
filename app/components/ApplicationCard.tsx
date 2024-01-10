import Link from "next/link";
import Text from "./Text";
import { EApplicationStatus } from "@/src/utils/types";
import { statusColorScheme } from "@/src/utils/common";

type ApplicationCardProps = {
    imageSrc: string;
    title: string;
    shortDescription: string;
    requestedAmount: string;
    submittedOn: string;
    status: EApplicationStatus;
    id: string;
    poolId: string;
};

export default function ApplcationCard({
    imageSrc,
    title,
    shortDescription,
    requestedAmount,
    submittedOn,
    status,
    id,
    poolId,
}: ApplicationCardProps) {
    return (
        <div
            key={id}
            className="w-full border-b-[3px] box-content border-b-color-400 bg-color-500 flex flex-col"
        >
            <div className="relative">
                <div
                    className={`px-2 py-1 absolute right-2 top-2 ${statusColorScheme[status]}`}
                >
                    <Text className="font-WorkSans text-[14px]">{status}</Text>
                </div>
                <img
                    src={imageSrc.length ? imageSrc : "/no_image_available.png"}
                />
            </div>
            <div className="flex flex-col w-full px-[20px] py-[15px] space-y-6">
                <div className="flex flex-col w-full space-y-2">
                    <Link href={`/pool/${poolId}/application/${id}`}>
                        <h4 className="font-PlayFairDisplay hover:underline italic">
                            {title}
                        </h4>
                    </Link>
                    <p className="font-WorkSans text-[14px]">
                        {shortDescription}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-[20px] font-SpaceMono">{`${requestedAmount} ETH`}</h3>
                        <p className="font-WorkSans">Requested Amount</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-[20px] font-SpaceMono">
                            {submittedOn}
                        </h3>
                        <p className="font-WorkSans">Submitted On</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
