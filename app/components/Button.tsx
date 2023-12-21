import { ButtonHTMLAttributes, ReactHTMLElement } from "react";

type ButtonProps = {
    isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    className,
    isLoading,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`font-PlayFairDisplay italic text-[20px] border border-color-300 bg-color-500 px-[17px] py-[10px] drop-shadow-[0px_4px_4px_rgba(0,0,0,.25)] whitespace-nowrap disabled:cursor-not-allowed disabled:text-color-400 ${className}`}
            disabled={isLoading}
            {...props}
        >
            {!isLoading ? children : "Loading..."}
        </button>
    );
}
