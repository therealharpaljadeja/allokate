"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import CropModal from "./CropModal";

export const aspectRatio = 7 / 2;

export default function ImageUpload(props: {
    setBase64Image: (base64Image: string) => void;
    previewImage?: string;
}) {
    const [imageName, setImageName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [openCropModal, setOpenCropModal] = useState(false);
    const [preview, setPreview] = useState("");
    const [imgUploadError, setImgUploadError] = useState(false);

    const handleFileChange = (e: any) => {
        setImgUploadError(false);
        const file = e.target.files[0];

        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

        if (file.size <= maxSize) {
            setImageFile(file);
            setImageName(file.name);
            setOpenCropModal(true);
        } else {
            setImgUploadError(true);
            setImageFile(null);
            setImageName("");
        }
    };

    const onCancel = () => {
        setImageFile(null);
        setImageName("");
        props.setBase64Image("");
    };

    const onComplete = (base64Image: string) => {
        props.setBase64Image(base64Image);
        setPreview(base64Image);
    };

    return (
        <div>
            <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-color-100"
            >
                Banner Image
            </label>
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-color-300 px-6 py-10">
                {!(preview !== "" || props.previewImage) && (
                    <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                    />
                )}

                {(preview !== "" || props.previewImage) && (
                    <Image
                        className="mx-auto"
                        width={300}
                        height={100}
                        src={preview}
                        alt="preview"
                    />
                )}
                <div className="mt-4 text-sm leading-6 text-gray-600">
                    <label
                        htmlFor="imageUrl"
                        className="relative cursor-pointer rounded-md bg-color-500 font-semibold text-color-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-color-300 focus-within:ring-offset-2 hover:text-color-200"
                    >
                        <span>Upload a file</span>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            type="file"
                            accept="image/png, image/jpeg"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                <p className="text-xs leading-5 text-gray-600 mt-2">
                    {imageName ? "File uploaded: " + imageName : ""}
                </p>
            </div>
            <CropModal
                aspectRatio={aspectRatio}
                file={imageFile}
                title={"Crop Image"}
                isOpen={openCropModal}
                setIsOpen={setOpenCropModal}
                closeModalText={"Close"}
                onCancel={onCancel}
                setBase64Image={onComplete}
            />
        </div>
    );
}
