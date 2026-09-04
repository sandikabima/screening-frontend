import React, { useState } from "react";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { Student } from "../types/student.types";
import StudentHeader from "../components/StudentHeader";
import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";
import useStudents from "../hooks/useStudents";
import useFaculties from "../../faculty/hooks/useFaculties";
import useStudyPrograms from "../../study/hooks/useStudyPrograms";
import useCohorts from "../../cohort/hooks/useCohorts";
import useClasses from "../../class/hooks/useClasses";

export const StudentsPage: React.FC = () => {
  const { faculties } = useFaculties();
  const { studyPrograms } = useStudyPrograms();
  const { cohorts } = useCohorts();
  const { classes } = useClasses();

  const {
    students,
    loading,
    submitting,
    deletingId,
    search,
    facultyFilter,
    studyProgramFilter,
    cohortFilter,
    classFilter,
    genderFilter,
    pagination,
    setSearch,
    setFacultyFilter,
    setStudyProgramFilter,
    setCohortFilter,
    setClassFilter,
    setGenderFilter,
    setPage,
    setLimit,
    refetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (st: Student) => {
    setSelectedStudent(st);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (st: Student) => {
    setStudentToDelete(st);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    const res = await deleteStudent(studentToDelete.id);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleSubmitForm = async (data: any) => {
    let res;
    if (selectedStudent) {
      res = await updateStudent(selectedStudent.id, data);
    } else {
      res = await createStudent(data);
    }

    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedStudent(null);
    }
    return res;
  };

  const handleResetAllFilters = () => {
    setSearch("");
    setFacultyFilter("");
    setStudyProgramFilter("");
    setCohortFilter("");
    setClassFilter("");
    setGenderFilter("");
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            DIREKTORI DATA MAHASISWA
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Civitas Akademika, Registrasi & Profil
            Kemahasiswaan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL MAHASISWA: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Mahasiswa
            </strong>
          </div>
        </div>
      </div>

      {/* FILTER & HEADER BAR */}
      <StudentHeader
        search={search}
        facultyFilter={facultyFilter}
        studyProgramFilter={studyProgramFilter}
        cohortFilter={cohortFilter}
        classFilter={classFilter}
        genderFilter={genderFilter}
        faculties={faculties}
        studyPrograms={studyPrograms}
        cohorts={cohorts}
        classes={classes}
        loading={loading}
        onSearchChange={setSearch}
        onFacultyFilterChange={setFacultyFilter}
        onStudyProgramFilterChange={setStudyProgramFilter}
        onCohortFilterChange={setCohortFilter}
        onClassFilterChange={setClassFilter}
        onGenderFilterChange={setGenderFilter}
        onRefresh={refetchStudents}
        onResetFilters={handleResetAllFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* TABLE DATA */}
      <StudentTable
        students={students}
        loading={loading}
        deletingId={deletingId}
        pagination={pagination}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* MODAL FORM (CREATE / EDIT) */}
      <StudentModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedStudent}
        faculties={faculties}
        studyPrograms={studyPrograms}
        cohorts={cohorts}
        classes={classes}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* MODAL CONFIRM DELETE */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Data Mahasiswa"
        description={`Apakah Anda yakin ingin menghapus data mahasiswa "${
          studentToDelete?.user?.name || "Mahasiswa"
        }" (${studentToDelete?.nim}) secara permanen? Akun dan data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isSubmitting={!!deletingId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default StudentsPage;
