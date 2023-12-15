"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
    [arbitrum, arbitrumSepolia],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
});

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
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
    );
}
