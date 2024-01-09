import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { useEffect, useState } from "react";

type AvatarProps = {
    salt?: string;
};

export default function Avatar({ salt }: AvatarProps) {
    const [imageUri, setImageUri] = useState("");

    useEffect(() => {
        (async () => {
            const avatar = createAvatar(notionists, {
                seed: `Allokate ${salt}`,
            });

            setImageUri(await avatar.toDataUri());
        })();
    }, []);

    return (
        <div>
            <img src={imageUri} className="w-32 h-32" />
        </div>
    );
}
