import { Pagination as PaginationMeta } from "@/shared/types/api";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
}) => {
  const { page, totalPages, total, limit } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-black p-3 border border-zinc-900 rounded-lg text-xs font-mono gap-3">
      <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
        <span>
          Halaman <strong className="text-zinc-200">{page}</strong> dari{" "}
          <strong className="text-zinc-200">{totalPages || 1}</strong> (Total{" "}
          {total} Data)
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <span>Baris:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={loading}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-red-600"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
