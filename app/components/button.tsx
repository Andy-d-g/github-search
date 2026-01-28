import type { ReactNode } from "react";

type Props = {
    children: ReactNode
    disabled?: boolean;
    onClick?: () => void
    className?: string;
}

export default function Button({ children, className = "", disabled = false, onClick = () => { } }: Props) {
    return (
        <button type="button" className={`p-3 border cursor-pointer ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}