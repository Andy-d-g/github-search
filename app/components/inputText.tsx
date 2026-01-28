type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: "text" | "number"
    placeholder?: string;
}

export default function Input({ placeholder, label, value, onChange, type }: Props) {

    function onBeforeChange(v: string) {
        if (type === 'number') {
            onChange(Number(v).toString())
            return
        }
        onChange(v)
    }

    return (
        <div className="my-1 mx-2">
            <label> {label} </label>
            <input
                type={type || 'text'}
                value={value}
                onChange={(e) => onBeforeChange(e.target.value)}
                placeholder={placeholder || '...'}
                className="w-full border p-3 cursor-pointer"
            />
        </div>
    );
}