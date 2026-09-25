import React from "react";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { ScreeningResultDetail } from "../../ScreeningResult/types/screeningResult.types";

interface SrqResponseTableProps {
  results: ScreeningResultDetail[];
  loading: boolean;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-64" },
  { width: "w-12" }, // Skeleton untuk Kolom JK
  { width: "w-16" },
  ...Array.from({ length: 20 }).map(() => ({ width: "w-6" })),
];

export const SrqResponseTable: React.FC<SrqResponseTableProps> = ({
  results,
  loading,
}) => {
  return (
    <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-black font-mono select-none w-full shadow-2xl">
      <table className="w-full text-left border-collapse min-w-[1350px]">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <th className="p-3 sticky left-0 bg-zinc-950 z-10 w-64 border-r border-zinc-900">
              MAHASISWA
            </th>
            {/* Kolom Jenis Kelamin */}
            <th className="p-3 text-center w-12 border-r border-zinc-900">
              JK
            </th>
            <th className="p-3 text-center w-16 border-r border-zinc-900">
              SKOR
            </th>
            {/* Header SOAL 1 s/d 20 */}
            {Array.from({ length: 20 }).map((_, i) => (
              <th key={i} className="p-2 text-center text-[9px] w-8">
                Q{i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/80 text-xs">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
            ))
          ) : results.length === 0 ? (
            <tr>
              <td
                colSpan={23}
                className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
              >
                BELUM ADA RESPONS JAWABAN MATRIKS.
              </td>
            </tr>
          ) : (
            results.map((r) => {
              const answers = r.rawResponses?.srqAnswers || [];
              const student = r.student;
              const studyProgramName = student?.studyProgram?.name || "-";
              const facultyName =
                (student?.studyProgram as any)?.faculty?.name || "-";

              // Formatting Gender (L/P)
              const rawGender = student?.gender?.toUpperCase() || "";
              const genderDisplay =
                rawGender === "L" || rawGender === "LAKI-LAKI"
                  ? "L"
                  : rawGender === "P" || rawGender === "PEREMPUAN"
                    ? "P"
                    : "-";

              return (
                <tr
                  key={r.id}
                  className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                >
                  <td className="p-3 sticky left-0 bg-black z-10 border-r border-zinc-900 whitespace-nowrap">
                    {/* Nama Mahasiswa */}
                    <div className="font-bold text-white text-xs">
                      {student?.user?.name || "N/A"}
                    </div>

                    {/* NIM, Prodi, & Fakultas */}
                    <div className="text-[10px] text-zinc-400 mt-1 flex flex-col gap-0.5">
                      <div>
                        NIM:{" "}
                        <span className="text-zinc-300 font-semibold">
                          {student?.nim || "-"}
                        </span>
                      </div>
                      <div
                        className="truncate max-w-[230px]"
                        title={studyProgramName}
                      >
                        Prodi:{" "}
                        <span className="text-zinc-300 font-semibold">
                          {studyProgramName}
                        </span>
                      </div>
                      <div
                        className="truncate max-w-[230px]"
                        title={facultyName}
                      >
                        Fakultas:{" "}
                        <span className="text-zinc-300 font-semibold">
                          {facultyName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Render Badge Jenis Kelamin (JK) */}
                  <td className="p-3 text-center border-r border-zinc-900">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        genderDisplay === "L"
                          ? "bg-blue-950/60 text-blue-400 border border-blue-800"
                          : genderDisplay === "P"
                            ? "bg-pink-950/60 text-pink-400 border border-pink-800"
                            : "text-zinc-600"
                      }`}
                      title={
                        genderDisplay === "L"
                          ? "Laki-Laki"
                          : genderDisplay === "P"
                            ? "Perempuan"
                            : "Belum diisi"
                      }
                    >
                      {genderDisplay}
                    </span>
                  </td>

                  {/* Render Skor SRQ */}
                  <td className="p-3 text-center font-bold text-amber-400 border-r border-zinc-900">
                    {r.srqScore}
                  </td>

                  {/* Render 20 Titik/Badge Jawaban SRQ */}
                  {Array.from({ length: 20 }).map((_, idx) => {
                    const isYes = answers[idx] === 1;
                    return (
                      <td key={idx} className="p-1 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                            isYes
                              ? "bg-amber-500 text-black shadow-[0_0_8px_#f59e0b]"
                              : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                          }`}
                        >
                          {isYes ? "1" : "0"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SrqResponseTable;
