import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                WorkSans: ["Work Sans"],
                PlayFairDisplay: ["PlayFair Display"],
                SpaceMono: ["Space Mono"],
            },
            colors: {
                "color-100": "hsl(212,10%,93%)",
                "color-200": "hsl(212,11%,77%)",
                "color-300": "hsl(212,10%,58%)",
                "color-400": "hsl(213,12%,36%)",
                "color-500": "hsl(216, 9%, 11%)",
                "color-600": "hsl(216, 7%, 14%)",
                "color-700": "hsl(214, 10%, 9%)",
            },
        },
    },
    plugins: [],
};
export default config;
