export default function Text({
    children,
    className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={`font-WorkSans ${className}`}>{children}</p>;
}
