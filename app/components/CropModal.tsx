"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactCrop, {
    type Crop,
    PixelCrop,
    makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "./Button";

export default function CropModal(props: {
    file: any;
    aspectRatio: any;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setBase64Image: (base64Image: string) => void;
    closeModalText?: string;
    onCancel: () => void;
    title?: string;
}) {
    const imgRef = useRef<HTMLImageElement>(null);

    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [crop, setCrop] = useState({} as Crop);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);

    function closeModal() {
        props.setIsOpen(false);
    }

    useEffect(() => {
        if (props.file) {
            const reader = new FileReader();

            reader.onload = async () => {
                setImageSrc(reader.result as unknown as string);

                try {
                    const blob = await fetch(reader.result as string).then(
                        (res) => res.blob()
                    );
                    const imageBitmap = await createImageBitmap(blob);

                    setImageSize({
                        width: imageBitmap.width,
                        height: imageBitmap.height,
                    });

                    setCrop(
                        makeAspectCrop(
                            {
                                unit: "%",
                                width: 90,
                            },
                            props.aspectRatio,
                            imageBitmap.width,
                            imageBitmap.height
                        )
                    );
                } catch (error) {
                    console.error("Error loading image:", error);
                }
            };

            reader.readAsDataURL(props.file);
        }
    }, [props.file]);

    const handleDone = async () => {
        if (!crop || !completedCrop) {
            return;
        }
        const previewImage = imgRef.current;

        const scaleX = imageSize.width / previewImage!.width;
        const scaleY = imageSize.height / previewImage!.height;

        const scaledWidth = completedCrop.width * scaleX;
        const scaledHeight = completedCrop.height * scaleY;

        const canvas = document.createElement("canvas");
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = imageSrc as unknown as string;

        await image.decode();

        ctx!.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            scaledWidth,
            scaledHeight,
            0,
            0,
            scaledWidth,
            scaledHeight
        );

        const base64Image = canvas.toDataURL("image/png").toString();
        props.setBase64Image(base64Image);
        props.setIsOpen(false);
    };

    const handleClose = () => {
        props.onCancel();
        props.setIsOpen(false);
    };

    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md items-center transform overflow-hidden border-2 border-color-300 bg-color-500 p-6 align-middle shadow-xl transition-all">
                                    {props.title && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                        >
                                            {props.title}
                                        </Dialog.Title>
                                    )}
                                    {imageSrc && (
                                        <>
                                            {" "}
                                            <ReactCrop
                                                crop={crop} // error here
                                                onChange={(c) => setCrop(c)}
                                                onComplete={(c) =>
                                                    setCompletedCrop(c)
                                                }
                                                aspect={props.aspectRatio}
                                            >
                                                <img
                                                    ref={imgRef}
                                                    src={
                                                        imageSrc as unknown as string
                                                    }
                                                />
                                            </ReactCrop>
                                            <p>Please select crop area.</p>
                                        </>
                                    )}

                                    <div className="mt-6 flex items-center justify-end gap-x-4">
                                        <Button
                                            className="!text-[14px] outline-none px-[8px] py-[5px]"
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="!text-[14px] outline-none px-[8px] py-[5px]"
                                            disabled={!completedCrop}
                                            onClick={handleDone}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
