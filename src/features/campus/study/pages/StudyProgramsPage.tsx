import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import {
  StudyProgram,
  CreateStudyProgramPayload,
} from "../types/studyProgram.types";
import StudyProgramHeader from "../components/StudyProgramHeader";
import StudyProgramTable from "../components/StudyProgramTable";
import StudyProgramModal from "../components/StudyProgramModal";
import useStudyPrograms from "../hooks/useStudyPrograms";
import useFaculties from "../../faculty/hooks/useFaculties";

export const StudyProgramsPage: React.FC = () => {
  const { faculties } = useFaculties();
  const {
    studyPrograms,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    facultyFilter,
    pagination,
    setSearch,
    setFacultyFilter,
    setPage,
    setLimit,
    refetchStudyPrograms,
    createStudyProgram,
    updateStudyProgram,
    toggleStatus,
    deleteStudyProgram,
  } = useStudyPrograms();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSP, setSelectedSP] = useState<StudyProgram | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spToDelete, setSpToDelete] = useState<StudyProgram | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedSP(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sp: StudyProgram) => {
    setSelectedSP(sp);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (sp: StudyProgram) => {
    setSpToDelete(sp);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!spToDelete) return;
    const res = await deleteStudyProgram(spToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setSpToDelete(null);
    }
  };

  const handleToggleStatus = async (sp: StudyProgram) => {
    await toggleStatus(sp.id, sp.isActive);
  };

  const handleSubmitForm = async (data: CreateStudyProgramPayload) => {
    let res;
    if (selectedSP) {
      res = await updateStudyProgram(selectedSP.id, data);
    } else {
      res = await createStudyProgram(data);
    }

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedSP(null);
    }
    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            PUSAT MANAJEMEN PROGRAM STUDI
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Direktori Program Studi, Jenjang & Fakultas
            Naungan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL TERDAFTAR: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Prodi
            </strong>
          </div>
        </div>
      </div>

      <StudyProgramHeader
        search={search}
        facultyFilter={facultyFilter}
        faculties={faculties}
        loading={loading}
        onSearchChange={setSearch}
        onFacultyFilterChange={setFacultyFilter}
        onRefresh={refetchStudyPrograms}
        onResetFilters={() => {
          setSearch("");
          setFacultyFilter("");
        }}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <StudyProgramTable
        studyPrograms={studyPrograms}
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

      <StudyProgramModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedSP}
        faculties={faculties}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Program Studi"
        description={`Apakah Anda yakin ingin menghapus program studi "${spToDelete?.name}" (${spToDelete?.code}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSpToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default StudyProgramsPage;
