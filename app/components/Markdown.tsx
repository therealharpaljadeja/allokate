"use client";

import { useEffect, useState } from "react";
import ReactMde, { Preview } from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const buttonStyles = `
  .mde-tabs button {
      padding-left: 5px;
      padding-right: 5px;
    }
  `;

export const MarkdownEditor = (props: {
    setText: (text: string) => void;
    value?: string;
}) => {
    const [value, setValue] = useState(props.value || "");
    const [selectedTab, setSelectedTab] = useState<
        "write" | "preview" | undefined
    >("write");

    const onChangeHandler = (value: string) => {
        setValue(value);
        props.setText(value);
    };

    useEffect(() => {
        if (!props.value) return;
        setValue(props.value);
    }, [props.value]);

    return (
        <div>
            <style>{buttonStyles}</style>
            <div className="container">
                <ReactMde
                    value={value}
                    onChange={onChangeHandler}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    classes={{
                        textArea:
                            "bg-color-500 outline-none focus:border-color-300",
                        toolbar: "!bg-color-500 text-color-100",
                    }}
                    generateMarkdownPreview={(markdown) =>
                        Promise.resolve(
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        )
                    }
                    childProps={{
                        commandButtons: {
                            style: { color: "#fff" },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export const MarkdownView = (props: { text: string }) => {
    return (
        <>
            <Preview
                minHeight={200}
                heightUnits="px"
                classes={"w-full"}
                markdown=""
                generateMarkdownPreview={() =>
                    Promise.resolve(<ReactMarkdown>{props.text}</ReactMarkdown>)
                }
            />
        </>
    );
};
