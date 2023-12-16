import { Tab } from "@headlessui/react";

export default function CustomTab({
    title,
    count,
}: {
    title: string;
    count?: number;
}) {
    return (
        <Tab className="flex outline-none hover:bg-color-100 hover:bg-opacity-10 px-[25px] py-[10px] space-x-[10px] items-center">
            <span className="font-WorkSans text-[16px]">{title}</span>
            {count && (
                <span className="font-WorkSans text- text-[12px] px-[10px] py-[2px] rounded-[10px] bg-color-400">
                    {count}
                </span>
            )}
        </Tab>
    );
}
