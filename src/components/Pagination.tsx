import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  previousTitle?: string;
  nextTitle?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  previousTitle = "Previous",
  nextTitle = "Next",
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center justify-center"
        title={previousTitle}
      >
        <GrFormPrevious size={18} />
      </button>
      <span className="text-gray-600 text-sm font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages || totalPages === 0}
        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center justify-center"
        title={nextTitle}
      >
        <GrFormNext size={18} />
      </button>
    </div>
  );
}
