export default function Title({
    children,
    classnames,
}: {
    children: string;
    classnames: string;
}) {
    return <p className={`font-PlayFairDisplay ${classnames}`}>{children}</p>;
}
