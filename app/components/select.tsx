type Props<T extends string = string> = {
    label: string;
    selected: string;
    onChange: (v: T) => void;
    options: Record<T, string>
    className?: string;
}

export default function Select<T extends string = string>({ label, className = "", selected, onChange, options }: Props<T>) {
    return (
        <div className={`m-3 ${className}`}>
            <label> {label} </label>
            <select value={selected} onChange={e => onChange(e.target.value as T)} className="w-full border p-3 cursor-pointer">
                ({
                    Object.entries(options).map(([optValue, optLabel]) => (
                        <option key={optValue} value={optValue} label={optLabel as T}> </option>
                    ))
                })
            </select>
        </div>
    );
}