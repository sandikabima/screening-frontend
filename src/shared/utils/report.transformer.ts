import { ScreeningResultDetail } from "@/features/result/ScreeningResult/types/screeningResult.types";

export interface FormattedReportData {
  docNumber: string;
  category: string;
  reasonCodeText: string;
  fillDate: string;
  printDate: string;
  student: {
    nim: string;
    initials: string;
    faculty: string;
    studyProgram: string;
    batch: string;
    className: string;
  };
  triageDetails: Array<{
    code: string;
    label: string;
    answer: string;
    score: string | number;
  }>;
  m1Tags: string[];
  administrative: {
    consent: string;
    status: string;
    lastFollowUp: string;
  };
  meta: {
    ruleVersion: string;
    calcTimestamp: string;
  };
  psychologistNotes?: string;
}

export const transformDetailToReport = (
  data: ScreeningResultDetail,
): FormattedReportData => {
  const student = data.student;
  const user = student?.user;
  const studyProgram = student?.studyProgram;
  const faculty = studyProgram?.faculty;
  const cohort = student?.cohort;
  const studentClass = student?.class;
  const raw = data.rawResponses || {};
  const indicators = raw.indicators || {};

  // 1. Ekstrak Inisial Nama (Contoh: "Dira Rahayu" -> "D. R.")
  const nameParts = user?.name?.trim().split(" ") || [];
  const initials =
    nameParts.map((p) => p[0]?.toUpperCase() + ".").join(" ") || "N/A";

  // 2. Format Tanggal Indonesia
  const formatDate = (dateVal?: string | Date | null) => {
    if (!dateVal) return "—";
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateVal?: string | Date | null) => {
    if (!dateVal) return "—";
    const d = new Date(dateVal);
    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr}, ${timeStr}`;
  };

  // 3. Mapping Label/Text Indikator Gejala
  const getImpactText = (score: number) => {
    if (score === 0) return "Tidak mengganggu";
    if (score === 1) return "Ringan / Kadang-kadang";
    if (score === 2) return "Cukup mengganggu";
    return "Sangat mengganggu";
  };

  const triageDetails = [
    {
      code: "SRQ",
      label: "Skor SRQ-20",
      answer: "—",
      score: `${data.srqScore ?? 0} / 20`,
    },
    {
      code: "F1",
      label: "Dampak akademik",
      answer: getImpactText(Number(indicators.f1 || 0)),
      score: String(indicators.f1 ?? 0),
    },
    {
      code: "F2",
      label: "Dampak aktivitas sehari-hari",
      answer: getImpactText(Number(indicators.f2 || 0)),
      score: String(indicators.f2 ?? 0),
    },
    {
      code: "C1",
      label: "Kemampuan menghadapi masalah",
      answer: Number(indicators.c1 || 0) > 0 ? "Mengalami kesulitan" : "Normal",
      score: String(indicators.c1 ?? 0),
    },
    {
      code: "S1",
      label: "Dukungan sosial",
      answer:
        Number(indicators.s1 || 0) > 0 ? "Ada tetapi jarang/kurang" : "Cukup",
      score: String(indicators.s1 ?? 0),
    },
    {
      code: "H1",
      label: "Kebutuhan bantuan",
      answer:
        Number(indicators.h1 || 0) > 0
          ? "Membutuhkan bantuan"
          : "Tidak membutuhkan",
      score: String(indicators.h1 ?? 0),
    },
  ];

  // 4. Priority Mapping
  const priorityMap: Record<string, string> = {
    P1: "P1 — EMERGENCY",
    P2: "P2 — HIGH RISK",
    P3: "P3 — MONITORING",
    P4: "P4 — PREVENTIF (NORMAL)",
  };

  // Reason Code Description Map
  const reasonMap: Record<string, string> = {
    R01: "Terindikasi Safety Flag (Risiko Menyakiti Diri / Emergency)",
    R02: "SRQ di atas cut-off, disertai indikator fungsi/kebutuhan bermakna",
    R03: "SRQ di atas cut-off tanpa indikator fungsi berat",
    R04: "SRQ di bawah cut-off tetapi indikator fungsi/kebutuhan bernilai positif",
    R05: "SRQ dan Indikator Fungsi dalam batas normal",
  };

  // Ambil followUp pertama jika ada
  const primaryFollowUp = Array.isArray(data.followUps)
    ? data.followUps[0]
    : undefined;

  const calculatedYear = data.calculatedAt
    ? new Date(data.calculatedAt).getFullYear()
    : new Date().getFullYear();

  return {
    docNumber: `SCR/${calculatedYear}/${data.id.slice(0, 6).toUpperCase()}`,
    category: priorityMap[data.priorityResult] || data.priorityResult,
    reasonCodeText: `${data.reasonCode} — ${reasonMap[data.reasonCode] || "Evaluasi Otomatis Sistem Triage"}`,
    fillDate: formatDate(data.calculatedAt),
    printDate: formatDate(new Date()),
    student: {
      nim: student?.nim || "—",
      initials,
      faculty: faculty?.name || "—",
      studyProgram: studyProgram?.name || "—",
      batch: cohort?.year ? String(cohort.year) : "—",
      className: studentClass?.name || "—",
    },
    triageDetails,
    m1Tags: raw.m1 || [],
    administrative: {
      consent: raw.safetyFlag ? "Ya" : "Ya",
      status: primaryFollowUp?.status || "Belum dihubungi",
      lastFollowUp: formatDate(primaryFollowUp?.createdAt),
    },
    meta: {
      ruleVersion: data.ruleVersion || "TRIAGE-V1.0",
      calcTimestamp: formatDateTime(data.calculatedAt),
    },
    psychologistNotes: primaryFollowUp?.notes ?? undefined,
  };
};
