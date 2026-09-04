import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { Faculty, CreateFacultyPayload } from "../types/faculty.types";
import FacultyHeader from "../components/FacultyHeader";
import FacultyTable from "../components/FacultyTable";
import FacultyModal from "../components/FacultyModal";
import useFaculties from "../hooks/useFaculties";

export const FacultiesPage: React.FC = () => {
  const {
    faculties,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    pagination,
    setSearch,
    setPage,
    setLimit,
    refetchFaculties,
    createFaculty,
    updateFaculty,
    toggleStatus,
    deleteFaculty,
  } = useFaculties();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedFaculty(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (faculty: Faculty) => {
    setFacultyToDelete(faculty);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!facultyToDelete) return;
    const res = await deleteFaculty(facultyToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setFacultyToDelete(null);
    }
  };

  const handleToggleStatus = async (faculty: Faculty) => {
    await toggleStatus(faculty.id, faculty.isActive);
  };

  const handleSubmitForm = async (data: CreateFacultyPayload) => {
    const res = selectedFaculty
      ? await updateFaculty(selectedFaculty.id, data)
      : await createFaculty(data);

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedFaculty(null);
    }

    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            PUSAT MANAJEMEN FAKULTAS
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Direktori Fakultas & Otoritas Hak Akses
            Operasional
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL TERDAFTAR: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Fakultas
            </strong>
          </div>
        </div>
      </div>

      <FacultyHeader
        search={search}
        loading={loading}
        onSearchChange={setSearch}
        onRefresh={refetchFaculties}
        onResetFilters={() => setSearch("")}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <FacultyTable
        faculties={faculties}
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

      <FacultyModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedFaculty}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Data Fakultas"
        description={`Apakah Anda yakin ingin menghapus fakultas "${facultyToDelete?.name}" (${facultyToDelete?.code}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFacultyToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FacultiesPage;
