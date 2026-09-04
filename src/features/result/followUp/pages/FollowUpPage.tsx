import React, { useState } from "react";
import useFollowUps from "../hooks/useFollowUps";
import FollowUpHeader from "../components/FollowUpHeader";
import { FollowUpTable } from "../components/FollowUpTable";
import { UpdateFollowUpModal } from "../components/UpdateFollowUpModal";
import { Pagination } from "@/shared/components/ui/Pagination";
import { FollowUpItem, FollowUpStatus } from "../types/followUp.types";

export const FollowUpPage: React.FC = () => {
  const {
    tickets,
    loading,
    submitting,
    search,
    statusFilter,
    priorityFilter,
    pagination,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setPage,
    setLimit,
    refetchFollowUps,
    updateTicket,
  } = useFollowUps(true);

  const [selectedTicket, setSelectedTicket] = useState<FollowUpItem | null>(
    null,
  );

  const handleUpdate = async (
    id: string,
    status: FollowUpStatus,
    notes: string,
  ) => {
    const res = await updateTicket(id, status, notes);
    if (res.success) {
      setSelectedTicket(null);
    }
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            TIKET INTERVENSI KLINIS & FOLLOW-UP
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Penanganan & Manajemen Konseling Psikolog Kasus Triage P1 - P3
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
          <span className="text-zinc-500 uppercase">TIKET AKTIF: </span>
          <strong className="text-amber-400 ml-1">
            {pagination?.total || 0} Tiket
          </strong>
        </div>
      </div>

      {/* Control Header */}
      <FollowUpHeader
        search={search}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        loading={loading}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onRefresh={refetchFollowUps}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("");
          setPriorityFilter("");
        }}
      />

      {/* Main Table */}
      <FollowUpTable
        tickets={tickets}
        loading={loading}
        onSelectTicket={(ticket) => setSelectedTicket(ticket)}
      />

      {/* Footer Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
        />
      )}

      {/* Update Modal */}
      <UpdateFollowUpModal
        isOpen={!!selectedTicket}
        loading={submitting}
        ticket={
          selectedTicket
            ? {
                id: selectedTicket.id,
                status: selectedTicket.status,
                notes: selectedTicket.notes,
                studentName:
                  selectedTicket.screeningResult?.student?.user?.name,
                priorityResult: selectedTicket.screeningResult?.priorityResult,
                handledByName: selectedTicket.handledBy?.name,
              }
            : null
        }
        onClose={() => setSelectedTicket(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default FollowUpPage;
