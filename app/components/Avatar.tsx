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
            <img src={imageUri} className="w-20 h-20" />
        </div>
    );
}
