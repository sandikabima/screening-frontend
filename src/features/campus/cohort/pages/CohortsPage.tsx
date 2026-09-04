import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { Cohort, CreateCohortPayload } from "../types/cohort.types";
import CohortHeader from "../components/CohortHeader";
import CohortTable from "../components/CohortTable";
import CohortModal from "../components/CohortModal";
import useCohorts from "../hooks/useCohorts";
import useStudyPrograms from "../../study/hooks/useStudyPrograms";

export const CohortsPage: React.FC = () => {
  const { studyPrograms } = useStudyPrograms();
  const {
    cohorts,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    studyProgramFilter,
    pagination,
    setSearch,
    setStudyProgramFilter,
    setPage,
    setLimit,
    refetchCohorts,
    createCohort,
    updateCohort,
    toggleStatus,
    deleteCohort,
  } = useCohorts();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cohortToDelete, setCohortToDelete] = useState<Cohort | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedCohort(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (c: Cohort) => {
    setSelectedCohort(c);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (c: Cohort) => {
    setCohortToDelete(c);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cohortToDelete) return;
    const res = await deleteCohort(cohortToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setCohortToDelete(null);
    }
  };

  const handleToggleStatus = async (c: Cohort) => {
    await toggleStatus(c.id, c.isActive);
  };

  const handleSubmitForm = async (data: CreateCohortPayload) => {
    let res;
    if (selectedCohort) {
      res = await updateCohort(selectedCohort.id, data);
    } else {
      res = await createCohort(data);
    }

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedCohort(null);
    }
    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            PUSAT MANAJEMEN ANGKATAN (COHORTS)
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Direktori Tahun Angkatan & Program Studi Naungan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL TERDAFTAR: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Angkatan
            </strong>
          </div>
        </div>
      </div>

      <CohortHeader
        search={search}
        studyProgramFilter={studyProgramFilter}
        studyPrograms={studyPrograms}
        loading={loading}
        onSearchChange={setSearch}
        onStudyProgramFilterChange={setStudyProgramFilter}
        onRefresh={refetchCohorts}
        onResetFilters={() => {
          setSearch("");
          setStudyProgramFilter("");
        }}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <CohortTable
        cohorts={cohorts}
        loading={loading}
        deletingId={deletingId}
        togglingId={togglingId}
        pagination={pagination}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleOpenDeleteModal}
      />

      <CohortModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedCohort}
        studyPrograms={studyPrograms}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Data Angkatan"
        description={`Apakah Anda yakin ingin menghapus data "${cohortToDelete?.name}" (${cohortToDelete?.year}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCohortToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CohortsPage;
