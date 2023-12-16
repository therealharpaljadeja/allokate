export default function Title({
    children,
    className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={`font-PlayFairDisplay ${className}`}>{children}</p>;
}
