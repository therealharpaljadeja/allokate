type PoolCardProps = {
    imageSrc: string;
    title: string;
    shortDescription: string;
    maxAllocation: string;
    amount: string;
    endDate: string;
    key: string;
};

export default function PoolCard({
    imageSrc,
    title,
    shortDescription,
    maxAllocation,
    amount,
    endDate,
    key,
}: PoolCardProps) {
    return (
        <div
            key={key}
            className="w-full border-b-[3px] box-content border-b-color-400 bg-color-500 flex flex-col"
        >
            <div>
                <img
                    src={
                        imageSrc.length ? imageSrc : "./no_image_available.png"
                    }
                />
            </div>
            <div className="flex flex-col w-full px-[20px] py-[15px] space-y-6">
                <div className="flex flex-col w-full space-y-2">
                    <h4 className="font-PlayFairDisplay italic">{title}</h4>
                    <p className="font-WorkSans text-[14px]">
                        {shortDescription}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-[20px] font-SpaceMono">{`${maxAllocation}/${amount} ETH`}</h3>
                        <p className="font-WorkSans">Max Allocation / Amount</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-[20px] font-SpaceMono">
                            {endDate}
                        </h3>
                        <p className="font-WorkSans">End Date</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
