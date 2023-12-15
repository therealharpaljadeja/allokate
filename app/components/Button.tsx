import { ButtonHTMLAttributes, ReactHTMLElement } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: ButtonProps) {
    return (
        <button
            className={`font-PlayFairDisplay text-[20px] border border-color-300 bg-color-500 px-[17px] py-[10px] drop-shadow-[0px_4px_4px_rgba(0,0,0,.25)] ${className}`}
            {...props}
        >
            {props.children}
        </button>
    );
}
