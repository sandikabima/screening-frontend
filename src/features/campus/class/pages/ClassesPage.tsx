import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { ClassEntity, CreateClassPayload } from "../types/class.types";
import ClassHeader from "../components/ClassHeader";
import ClassTable from "../components/ClassTable";
import ClassModal from "../components/ClassModal";
import useClasses from "../hooks/useClasses";
import useStudyPrograms from "../../study/hooks/useStudyPrograms";
import useCohorts from "../../cohort/hooks/useCohorts";

export const ClassesPage: React.FC = () => {
  const { studyPrograms } = useStudyPrograms();
  const { cohorts } = useCohorts();
  const {
    classes,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    studyProgramFilter,
    cohortFilter,
    pagination,
    setSearch,
    setStudyProgramFilter,
    setCohortFilter,
    setPage,
    setLimit,
    refetchClasses,
    createClass,
    updateClass,
    toggleStatus,
    deleteClass,
  } = useClasses();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassEntity | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassEntity | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedClass(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassEntity) => {
    setSelectedClass(cls);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (cls: ClassEntity) => {
    setClassToDelete(cls);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    const res = await deleteClass(classToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  const handleToggleStatus = async (cls: ClassEntity) => {
    await toggleStatus(cls.id, cls.isActive);
  };

  const handleSubmitForm = async (data: CreateClassPayload) => {
    let res;
    if (selectedClass) {
      res = await updateClass(selectedClass.id, data);
    } else {
      res = await createClass(data);
    }

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedClass(null);
    }
    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            PUSAT MANAJEMEN KELAS
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Rombongan Belajar, Program Studi & Angkatan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL TERDAFTAR: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Kelas
            </strong>
          </div>
        </div>
      </div>

      <ClassHeader
        search={search}
        studyProgramFilter={studyProgramFilter}
        cohortFilter={cohortFilter}
        studyPrograms={studyPrograms}
        cohorts={cohorts}
        loading={loading}
        onSearchChange={setSearch}
        onStudyProgramFilterChange={setStudyProgramFilter}
        onCohortFilterChange={setCohortFilter}
        onRefresh={refetchClasses}
        onResetFilters={() => {
          setSearch("");
          setStudyProgramFilter("");
          setCohortFilter("");
        }}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <ClassTable
        classes={classes}
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

      <ClassModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedClass}
        studyPrograms={studyPrograms}
        cohorts={cohorts}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Data Kelas"
        description={`Apakah Anda yakin ingin menghapus data kelas "${classToDelete?.name}" (${classToDelete?.code}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setClassToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ClassesPage;
