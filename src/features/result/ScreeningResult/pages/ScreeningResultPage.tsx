import React, { useState } from "react";
import ScreeningResultHeader from "../components/ScreeningResultHeader";
import ScreeningResultTable from "../components/ScreeningResultTable";
import { ScreeningResultDetailModal } from "../components/ScreeningResultDetailModal";
import { Pagination } from "@/shared/components/ui/Pagination";
import useScreeningResults from "../hooks/useScreeningResults";

export const ScreeningResultPage: React.FC = () => {
  const {
    results,
    loading,
    detailData,
    loadingDetail,
    search,
    priorityFilter,
    pagination,
    setSearch,
    setPriorityFilter,
    setPage,
    setLimit,
    refetchResults,
    fetchResultDetail,
    clearDetail,
  } = useScreeningResults(true);

  const [inspectingId, setInspectingId] = useState<string | null>(null);

  const handleOpenInspectModal = async (id: string) => {
    setInspectingId(id);
    await fetchResultDetail(id);
  };

  const handleCloseInspectModal = () => {
    setInspectingId(null);
    clearDetail();
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            KONSOL EVALUASI SCREENING & TRIAGE
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Monitoring Hasil Diagnostik SRQ20 & Prioritas Intervensi Klinis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL LOG HASIL: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Record
            </strong>
          </div>
        </div>
      </div>

      {/* Filter Control Header */}
      <ScreeningResultHeader
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

      {/* Table Main Content */}
      <ScreeningResultTable
        results={results}
        loading={loading}
        onInspect={handleOpenInspectModal}
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

      {/* Detail Response Modal */}
      <ScreeningResultDetailModal
        isOpen={!!inspectingId}
        loading={loadingDetail}
        data={detailData}
        onClose={handleCloseInspectModal}
      />
    </div>
  );
};

export default ScreeningResultPage;
