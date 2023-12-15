"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./Button";

export default function CustomConnectButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        Get Started
                                    </Button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </Button>
                                );
                            }

                            return (
                                <div style={{ display: "flex" }}>
                                    <Button
                                        onClick={openChainModal}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 999,
                                                    overflow: "hidden",
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={
                                                            chain.name ??
                                                            "Chain icon"
                                                        }
                                                        src={chain.iconUrl}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={openAccountModal}
                                        type="button"
                                    >
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ""}
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
