import React, { useState } from "react";
import { Question } from "../types/question.types";
import QuestionHeader from "../components/QuestionHeader";
import QuestionTable from "../components/QuestionTable";
import QuestionModal from "../components/QuestionModal";
import useQuestions from "../hooks/useQuestions";

export const TriageQuestionsPage: React.FC = () => {
  const {
    questions,
    loading,
    submitting,
    togglingId,
    search,
    setSearch,
    refetchQuestions,
    updateQuestionText,
    toggleStatus,
  } = useQuestions("INTI");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const handleOpenEditModal = (q: Question) => {
    setSelectedQuestion(q);
    setIsFormModalOpen(true);
  };

  const handleToggleStatus = async (q: Question) => {
    await toggleStatus(q.id, q.isActive);
  };

  const handleSubmitForm = async (id: string, text: string) => {
    const res = await updateQuestionText(id, { questionText: text });
    if (res?.success) {
      setIsFormModalOpen(false);
      setSelectedQuestion(null);
    }
    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#9333ea]" />
            MANAJEMEN PERTANYAAN INTI TRIAGE
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Direktori 7 Pertanyaan Spesifik Indikator Fungsi, Coping, Support, &
            Safety Flag
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL SOAL INTI: </span>
            <strong className="text-white ml-1">{questions.length} Soal</strong>
          </div>
        </div>
      </div>

      {/* QUESTION HEADER (1 SEARCH + ACTION BUTTONS) */}
      <QuestionHeader
        search={search}
        loading={loading}
        onSearchChange={setSearch}
        onRefresh={refetchQuestions}
        onResetFilters={() => setSearch("")}
      />

      {/* TABLE DATA */}
      <QuestionTable
        questions={questions}
        loading={loading}
        togglingId={togglingId}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* MODAL EDIT */}
      <QuestionModal
        isOpen={isFormModalOpen}
        submitting={submitting}
        initialData={selectedQuestion}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default TriageQuestionsPage;
