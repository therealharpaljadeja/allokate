export default function Text({
    children,
    classnames,
}: {
    children: string;
    classnames: string;
}) {
    return <p className={`font-WorkSans ${classnames}`}>{children}</p>;
}
