import Divider from "./Divider";
import Text from "./Text";
import Title from "./Title";

type SideTableItem = {
    label: string;
    value: React.ReactNode;
    lastItem?: boolean;
};

type SideTableProps = {
    title: string;
    items: SideTableItem[];
};

function SideTableItem({ label, value, lastItem }: SideTableItem) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Text>{label}</Text>
                {value}
            </div>
            {lastItem ? null : <Divider />}
        </div>
    );
}

export default function SideTable({ title, items }: SideTableProps) {
    return (
        <div className="w-full flex flex-col border border-color-400 px-6 py-4">
            <Title className="text-[20px] mb-6">{title}</Title>
            <div className="flex flex-col space-y-4">
                {items.map(({ label, value }, index) => {
                    return (
                        <SideTableItem
                            label={label}
                            value={value}
                            lastItem={index == items.length - 1}
                            key={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}
