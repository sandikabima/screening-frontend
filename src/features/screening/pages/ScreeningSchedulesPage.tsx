import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { ScreeningSchedule } from "../types/screeningSchedule.types";
import ScreeningScheduleHeader from "../components/ScreeningScheduleHeader";
import ScreeningScheduleTable from "../components/ScreeningScheduleTable";
import ScreeningScheduleModal from "../components/ScreeningScheduleModal";
import useScreeningSchedules from "../hooks/useScreeningSchedules";
import useTesterOptions from "../hooks/useTesterOptions";

export const ScreeningSchedulesPage: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScreeningSchedule | null>(null);

  const { testers, loadingTesters } = useTesterOptions(isFormModalOpen);

  const {
    schedules,
    loading,
    submitting,
    deletingId,
    search,
    statusBarcode,
    pagination,
    setSearch,
    setStatusBarcode,
    setPage,
    setLimit,
    refetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useScreeningSchedules(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<ScreeningSchedule | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedSchedule(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sc: ScreeningSchedule) => {
    setSelectedSchedule(sc);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (sc: ScreeningSchedule) => {
    setScheduleToDelete(sc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scheduleToDelete) return;
    const res = await deleteSchedule(scheduleToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleSubmitForm = async (data: any) => {
    let res;
    if (selectedSchedule) {
      res = await updateSchedule(selectedSchedule.id, data);
    } else {
      res = await createSchedule(data);
    }

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedSchedule(null);
    }
    return res;
  };

  const handleResetAllFilters = () => {
    setSearch("");
    setStatusBarcode("");
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            MANAJEMEN BATCH & JADWAL SCREENING
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pembentukan Jadwal Batch, Generator Barcode / QR Code &
            Otoritas Sesi Tes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL JADWAL: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Batch
            </strong>
          </div>
        </div>
      </div>

      {/* FILTER & HEADER BAR */}
      <ScreeningScheduleHeader
        search={search}
        statusBarcodeFilter={statusBarcode}
        loading={loading}
        onSearchChange={setSearch}
        onStatusBarcodeFilterChange={setStatusBarcode}
        onRefresh={refetchSchedules}
        onResetFilters={handleResetAllFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* TABLE DATA */}
      <ScreeningScheduleTable
        schedules={schedules}
        loading={loading}
        deletingId={deletingId}
        pagination={pagination}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* MODAL FORM (CREATE / EDIT) */}
      <ScreeningScheduleModal
        isOpen={isFormModalOpen}
        submitting={submitting || loadingTesters}
        initialData={selectedSchedule}
        testers={testers} // <-- Teruskan data testers di sini!
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* MODAL CONFIRM DELETE */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Jadwal Batch Screening"
        description={`Apakah Anda yakin ingin menghapus jadwal batch "${
          scheduleToDelete?.name || "Jadwal"
        }" (${scheduleToDelete?.barcodeValue}) secara permanen? Sesi mahasiswa yang terhubung pada jadwal ini dapat terpengaruh.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setScheduleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ScreeningSchedulesPage;
