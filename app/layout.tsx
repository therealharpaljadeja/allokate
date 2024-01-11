import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import RootClientComponent from "./components/RootClientComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AlloKate",
    description: "AlloKate",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} flex justify-center items-center`}
            >
                <RootClientComponent>{children}</RootClientComponent>
            </body>
        </html>
    );
}
