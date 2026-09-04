import React, { useState } from "react";
import SrqCutOffModal from "../components/SrqCutOffModal";
import useSrqCutOff from "../hooks/useSrqCutOff";
import SrqCutOffHeader from "../components/SrqCutOffHeader";

export const SrqCutOffPage: React.FC = () => {
  const { cutOff, loading, submitting, refetchCutOff, updateCutOff } =
    useSrqCutOff();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (payload: any) => {
    const res = await updateCutOff(payload);
    if (res?.success) {
      setIsModalOpen(false);
    }
    return res;
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            MANAJEMEN CUT-OFF SRQ-20
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Konsol Pengaturan Batas Skor WHO Baku untuk Penentuan Indikasi
            Masalah Psikologis
          </p>
        </div>
      </div>

      <SrqCutOffHeader
        loading={loading}
        cutoffScore={cutOff?.cutoffScore}
        onRefresh={refetchCutOff}
        onOpenEditModal={handleOpenEditModal}
      />

      <SrqCutOffModal
        isOpen={isModalOpen}
        submitting={submitting}
        initialData={cutOff}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default SrqCutOffPage;
