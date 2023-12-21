import { createAvatar } from "@dicebear/core";
import { bigEarsNeutral } from "@dicebear/collection";
import { useEffect, useState } from "react";

type AvatarProps = {
    salt?: string;
};

export default function Avatar({ salt }: AvatarProps) {
    const [imageUri, setImageUri] = useState("");

    useEffect(() => {
        (async () => {
            const avatar = createAvatar(bigEarsNeutral, {
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
