import Button from "./button";

type Props = {
    currentPage: number;
    onChange: (newPage: number) => void;
    isComplete: boolean;
}

export function Pagination({ currentPage, onChange, isComplete }: Props) {
    return (
        <div className="flex items-center space-x-3">
            {currentPage > 1 && <Button
                onClick={() => onChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>}

            <span className="text-sm font-semibold text-slate-600">
                Page {currentPage}
            </span>

            {!isComplete && <Button
                onClick={() => onChange(currentPage + 1)}
            >
                Next
            </Button>}
        </div>
    );
}