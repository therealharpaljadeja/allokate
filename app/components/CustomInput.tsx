import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

const CustomInput = forwardRef(
    (
        { className, ...props }: InputHTMLAttributes<HTMLInputElement>,
        ref: ForwardedRef<HTMLInputElement>
    ) => {
        return (
            <input
                ref={ref}
                className={`focus:border-color-300 text-WorkSans text-[16px] outline-none px-4 py-2 text-color-100 bg-color-500 border-2 border-color-400 disabled:text-color-400 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
        );
    }
);

export default CustomInput;
