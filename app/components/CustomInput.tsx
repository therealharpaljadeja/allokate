import { InputHTMLAttributes } from "react";

export default function CustomInput({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`focus:border-color-300 text-WorkSans text-[16px] outline-none px-4 py-2 text-color-100 bg-color-500 border-2 border-color-400 ${className}`}
            {...props}
        />
    );
}
