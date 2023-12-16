import ApplicationActivity from "@/app/components/ApplicationActivity";
import SideTable from "@/app/components/SideTable";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";

const SideTableItems = [{ label: "Amount", value: 2 }];

export default function Application() {
    return (
        <div className="flex flex-col space-y-8">
            <div className="w-full flex">
                <img src="/application_image.png" />
            </div>
            <div className="w-full grid grid-cols-3 gap-x-6">
                <div className="col-span-2 flex flex-col space-y-6">
                    <Title className="text-[30px] italic">
                        The Great Great Unicorn Farm
                    </Title>
                    <div className="flex border border-color-400 p-4 flex-col space-y-4">
                        <div className="grid grid-cols-3 items-start">
                            <Text>Application Id </Text>
                            <Text className="col-span-2 !font-SpaceMono">
                                0x470bc34b957a9841b0f540714ef7e3544496f873
                            </Text>
                        </div>
                        <div className="grid grid-cols-3 items-start">
                            <Text>Recipient Address</Text>
                            <Text className="col-span-2 !font-SpaceMono">
                                0x470bc34b957a9841b0f540714ef7e3544496f873
                            </Text>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col space-y-6">
                    <SideTable
                        title="Application Details"
                        items={SideTableItems}
                    />
                    <ApplicationActivity />
                </div>
            </div>
        </div>
    );
}
