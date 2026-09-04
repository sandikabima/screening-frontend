import React from "react";
import useScreeningResults from "../../ScreeningResult/hooks/useScreeningResults";
import SrqResponseHeader from "../components/SrqResponseHeader";
import SrqResponseTable from "../components/SrqResponseTable";
import { Pagination } from "@/shared/components/ui/Pagination";
import { ScreeningResultDetail } from "../../ScreeningResult/types/screeningResult.types";

export const SrqResponsePage: React.FC = () => {
  const {
    results,
    loading,
    search,
    priorityFilter,
    pagination,
    setSearch,
    setPriorityFilter,
    setPage,
    setLimit,
    refetchResults,
  } = useScreeningResults(true);

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            MATRIKS RESPONS SRQ-20 MAHASISWA
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Inspeksi Langsung Sebaran 20 Item Pertanyaan SRQ Seluruh Sesi
            Screening
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL AUDIT: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Mahasiswa
            </strong>
          </div>
        </div>
      </div>

      {/* Filter Control Header */}
      <SrqResponseHeader
        search={search}
        priorityFilter={priorityFilter}
        loading={loading}
        onSearchChange={setSearch}
        onPriorityFilterChange={setPriorityFilter}
        onRefresh={refetchResults}
        onResetFilters={() => {
          setSearch("");
          setPriorityFilter("");
        }}
      />

      {/* Full 20-Questions Matrix Table */}
      <SrqResponseTable
        results={results as ScreeningResultDetail[]}
        loading={loading}
      />

      {/* Footer Pagination Controls */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SrqResponsePage;
