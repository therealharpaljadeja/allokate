"use client";

import ApplicationActivity from "@/app/components/ApplicationActivity";
import SideTable from "@/app/components/SideTable";
import Text from "@/app/components/Text";
import Title from "@/app/components/Title";
import { getApplicationData } from "@/src/utils/request";
import { TMicroGrantRecipientByAppIdClientSide } from "@/src/utils/types";
import { useEffect, useState } from "react";

const SideTableItems = [{ label: "Amount", value: 2 }];

export default function Application({
    params,
}: {
    params: { id: string; appId: string };
}) {
    const [application, setApplication] = useState<
        TMicroGrantRecipientByAppIdClientSide | undefined
    >();
    let { appId, id: poolId } = params;

    useEffect(() => {
        (async () => {
            let application = await getApplicationData("421614", poolId, appId);
            setApplication(application);
            console.log(application);
        })();
    }, []);

    if (!application)
        return <Text className="font-WorkSans text-[24px]">Loading...</Text>;

    if (!Object.keys(application).length)
        return (
            <Text className="font-WorkSans text-[24px]">
                No Such Application
            </Text>
        );

    return (
        <div className="flex w-full flex-col space-y-8">
            <div className="w-full flex">
                <img
                    className="w-full"
                    src={application.metadata?.image?.data}
                />
            </div>
            <div className="w-full grid grid-cols-3 gap-x-6">
                <div className="col-span-2 flex flex-col space-y-6">
                    <Title className="text-[30px] italic">
                        {application.metadata?.name}
                    </Title>
                    <div className="flex border border-color-400 p-4 flex-col space-y-4">
                        <div className="grid grid-cols-3 items-start">
                            <Text>Application Id </Text>
                            <Text className="col-span-2 !font-SpaceMono">
                                {appId}
                            </Text>
                        </div>
                        <div className="grid grid-cols-3 items-start">
                            <Text>Recipient Address</Text>
                            <Text className="col-span-2 !font-SpaceMono">
                                {application.recipientAddress}
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
