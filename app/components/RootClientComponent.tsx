"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
    RainbowKitProvider,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrumSepolia } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";
import CustomConnectButton from "./CustomConnectButton";
import Title from "./Title";
import Link from "next/link";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import UserNavMenu from "./UserNavMenu";
import { Toaster } from "react-hot-toast";
import RootContextProvider from "../context/RootContext";

const { chains, publicClient } = configureChains(
    [arbitrumSepolia],
    [publicProvider()]
);

const connectors = connectorsForWallets([
    {
        groupName: "Supported",
        wallets: [metaMaskWallet({ chains, projectId: "" })],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export default function RootClientComponent({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        // Define default options
                        className: "toast",
                        duration: 20000,

                        // Default options for specific types
                        success: {
                            duration: 3000,
                        },
                    }}
                />
                <RootContextProvider>
                    <main className="flex min-h-screen min-w-[1280px] space-y-[40px] flex-col items-center px-[60px] py-[30px] max-w-[1280px]">
                        <div className="flex w-[100%] justify-between items-center">
                            <div>
                                <Link href={"/"}>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src="/lotus.svg"
                                            className="h-10 w-16 fill-white"
                                        />
                                        <Title className="text-[28px] italic">
                                            AlloKate
                                        </Title>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex space-x-8 items-center">
                                <UserNavMenu />
                                <CustomConnectButton />
                            </div>
                        </div>
                        {children}
                    </main>
                </RootContextProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
