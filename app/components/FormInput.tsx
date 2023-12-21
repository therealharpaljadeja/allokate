import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import CustomInput from "./CustomInput";
import Text from "./Text";

type FormInputProps = {
    inputProps: React.HTMLAttributes<HTMLInputElement>;
    labelProps: React.HTMLAttributes<HTMLLabelElement>;
    errors: FieldErrors;
    register: any;
};

export default function FormInput(props: FormInputProps) {
    return (
        <div className="flex w-full flex-col space-y-2">
            <label {...props.labelProps}>{props.labelProps}</label>
            <CustomInput
                {...props.register(props.inputProps.id)}
                {...props.inputProps}
            />
            {props.errors.name && (
                <Text className="text-red-500">
                    {props.errors.name.message as string}
                </Text>
            )}
        </div>
    );
}
