import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { ScreeningSession } from "../types/screeningSession.types";
import ScreeningSessionTable from "../components/ScreeningSessionTable";
import useScreeningSessions from "../hooks/useScreeningSessions";
import useScreeningSchedules from "@/features/screening/hooks/useScreeningSchedules";
import ScreeningSessionHeader from "../components/ScreeningSessionHeader";

export const ScreeningSessionsPage: React.FC = () => {
  const { schedules } = useScreeningSchedules(true);

  const {
    sessions,
    loading,
    deletingId,
    scheduleId,
    status,
    pagination,
    setScheduleId,
    setStatus,
    setPage,
    setLimit,
    refetchSessions,
    deleteSession,
  } = useScreeningSessions(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<ScreeningSession | null>(null);

  const handleOpenDeleteModal = (sess: ScreeningSession) => {
    setSessionToDelete(sess);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    const res = await deleteSession(sessionToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setScheduleId("");
    setStatus("");
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            KONSOL MONITORING SESI SCREENING
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Log Real-Time Kehadiran Mahasiswa & Audit Trail Sesi Tes Screening
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL LOG SESI: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Mahasiswa
            </strong>
          </div>
        </div>
      </div>

      {/* FILTER HEADER */}
      <ScreeningSessionHeader
        scheduleFilter={scheduleId}
        statusFilter={status}
        schedules={schedules}
        loading={loading}
        onScheduleFilterChange={setScheduleId}
        onStatusFilterChange={setStatus}
        onRefresh={refetchSessions}
        onResetFilters={handleResetFilters}
      />

      {/* DATA TABLE */}
      <ScreeningSessionTable
        sessions={sessions}
        loading={loading}
        deletingId={deletingId}
        pagination={pagination}
        setPage={setPage}
        setLimit={setLimit}
        onDelete={handleOpenDeleteModal}
      />

      {/* CONFIRM RESET / DELETE */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Reset Sesi Screening Mahasiswa"
        description={`Apakah Anda yakin ingin menghapus sesi mahasiswa "${
          sessionToDelete?.student?.user?.name || "Mahasiswa"
        }" (${sessionToDelete?.student?.nim})? Setelah dihapus, mahasiswa akan diizinkan untuk memverifikasi barcode ulang.`}
        confirmText="Reset Sesi"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ScreeningSessionsPage;
