import Text from "./Text";

export default function Card({
    count,
    title,
}: {
    count: string;
    title: string;
}) {
    return (
        <div className="bg-color-500 box-content border-b-[5px] border-b-color-400 w-full flex-col px-[40px] py-[20px]">
            <h2 className="font-SpaceMono text-[48px]">{count}</h2>
            <Text className="text-[20px]">{title}</Text>
        </div>
    );
}
