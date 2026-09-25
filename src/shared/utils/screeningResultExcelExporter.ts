import { ScreeningResultDetail } from "@/features/result/ScreeningResult/types/screeningResult.types";
import ExcelJS from "exceljs";

export const exportScreeningResultsToExcel = async (
  dataList: ScreeningResultDetail[],
  filenamePrefix = "Laporan_Matriks_SRQ20_Lengkap",
) => {
  if (!dataList || dataList.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "UPT Layanan Psikologi & Difabel";
  workbook.created = new Date();

  // -------------------------------------------------------------
  // PALETTE & STYLES (Theme: UPT Emerald Green)
  // -------------------------------------------------------------
  const COLOR_PRIMARY_GREEN = "FF15803D"; // Hijau UPT (#15803D)
  const COLOR_NAVY_DARK = "FF0F172A"; // Slate Dark (#0F172A)
  const COLOR_ZEBRA_GREEN = "FFF0FDF4"; // Emerald-50 (#F0FDF4)
  const COLOR_BORDER = "FFCBD5E1"; // Slate-300 (#CBD5E1)

  const headerFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLOR_PRIMARY_GREEN },
  };

  const zebraFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLOR_ZEBRA_GREEN },
  };

  const headerFont: Partial<ExcelJS.Font> = {
    name: "Segoe UI",
    size: 11,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: COLOR_BORDER } },
    left: { style: "thin", color: { argb: COLOR_BORDER } },
    bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    right: { style: "thin", color: { argb: COLOR_BORDER } },
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "P1":
        return { bg: "FFFEE2E2", font: "FF991B1B" }; // Merah
      case "P2":
        return { bg: "FFFFEDD5", font: "FF9A3412" }; // Oranye
      case "P3":
        return { bg: "FFFEF9C3", font: "FF854D0E" }; // Kuning
      case "P4":
        return { bg: "FFDCFCE7", font: "FF166534" }; // Hijau
      default:
        return null;
    }
  };

  // -------------------------------------------------------------
  // SHEET 1: MATRIKS DETAIL JAWABAN SRQ-20
  // -------------------------------------------------------------
  const sheetMatrix = workbook.addWorksheet("Matriks Jawaban SRQ-20");

  // 1. Header Judul Laporan UPT Baiturrahmah
  sheetMatrix.getCell("A1").value = "UNIVERSITAS BAITURRAHMAH";
  sheetMatrix.getCell("A1").font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: COLOR_NAVY_DARK },
  };

  sheetMatrix.getCell("A2").value =
    "UPT LAYANAN PSIKOLOGI DAN DIFABEL — DIAGNOSTIC EXECUTIVE REPORT";
  sheetMatrix.getCell("A2").font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF059669" },
  };

  sheetMatrix.getCell("A3").value =
    `Tanggal Ekspor Laporan: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
  sheetMatrix.getCell("A3").font = {
    name: "Segoe UI",
    size: 9,
    italic: true,
    color: { argb: "FF64748B" },
  };

  sheetMatrix.addRow([]); // Blank row pembatas (Baris 4)

  // 2. Table Header Matriks Jawaban (Baris 5)
  const matrixHeaders = [
    "No",
    "NIM",
    "Nama Mahasiswa",
    "JK",
    "Fakultas",
    "Program Studi",
    "Angkatan",
    "Kelas",
    "Skor Total",
    ...Array.from({ length: 20 }).map((_, i) => `Q${i + 1}`),
  ];
  sheetMatrix.addRow(matrixHeaders);

  const headerRow1 = sheetMatrix.getRow(5);
  headerRow1.height = 28;
  headerRow1.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // 3. Populate Data Rows
  dataList.forEach((r, idx) => {
    const student = r.student;
    const user = student?.user;
    const studyProgram = student?.studyProgram;
    const faculty = (studyProgram as any)?.faculty;
    const cohort = student?.cohort;
    const studentClass = (student as any)?.class;
    const raw = r.rawResponses || {};
    const srqAnswers = raw.srqAnswers || Array(20).fill(0);

    const rawGender = student?.gender?.toUpperCase() || "";
    const genderDisplay =
      rawGender === "L" || rawGender === "LAKI-LAKI"
        ? "L"
        : rawGender === "P" || rawGender === "PEREMPUAN"
          ? "P"
          : "-";

    const rowData = [
      idx + 1,
      student?.nim || "-",
      user?.name || "-",
      genderDisplay,
      faculty?.name || "-",
      studyProgram?.name || "-",
      cohort?.year ? String(cohort.year) : "-",
      studentClass?.name || "-",
      r.srqScore ?? 0,
      ...srqAnswers,
    ];

    const row = sheetMatrix.addRow(rowData);
    row.height = 22;

    const isEven = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Segoe UI", size: 10 };

      if (isEven) {
        cell.fill = zebraFill;
      }

      if ([3, 5, 6].includes(colNumber)) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }

      if (colNumber >= 9) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // Set Width Columns
  sheetMatrix.columns = [
    { width: 6 }, // No
    { width: 16 }, // NIM
    { width: 28 }, // Nama
    { width: 8 }, // JK
    { width: 26 }, // Fakultas
    { width: 26 }, // Prodi
    { width: 12 }, // Angkatan
    { width: 12 }, // Kelas
    { width: 12 }, // Skor
    ...Array.from({ length: 20 }).map(() => ({ width: 5 })), // Q1-Q20
  ];

  // -------------------------------------------------------------
  // SHEET 2: REKAP HASIL SCREENING & TRIAGE
  // -------------------------------------------------------------
  const sheetSummary = workbook.addWorksheet("Rekap Hasil & Triage");

  // 1. Header Judul Laporan Sheet 2
  sheetSummary.getCell("A1").value = "UNIVERSITAS BAITURRAHMAH";
  sheetSummary.getCell("A1").font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: COLOR_NAVY_DARK },
  };

  sheetSummary.getCell("A2").value =
    "UPT LAYANAN PSIKOLOGI DAN DIFABEL — DIAGNOSTIC EXECUTIVE REPORT";
  sheetSummary.getCell("A2").font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF059669" },
  };

  sheetSummary.getCell("A3").value =
    `Tanggal Ekspor Laporan: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
  sheetSummary.getCell("A3").font = {
    name: "Segoe UI",
    size: 9,
    italic: true,
    color: { argb: "FF64748B" },
  };

  sheetSummary.addRow([]); // Blank row pembatas (Baris 4)

  // 2. Table Header Rekap Triage (Baris 5)
  const summaryHeaders = [
    "No",
    "NIM",
    "Nama Mahasiswa",
    "Jenis Kelamin",
    "Fakultas",
    "Program Studi",
    "Angkatan",
    "Kelas",
    "Skor SRQ",
    "Prioritas",
    "Reason Code",
    "Safety Flag",
    "Masalah Utama (M1)",
    "Status Follow Up",
    "Tanggal Kalkulasi",
  ];
  sheetSummary.addRow(summaryHeaders);

  const headerRow2 = sheetSummary.getRow(5);
  headerRow2.height = 28;
  headerRow2.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // 3. Populate Data Rows Sheet 2
  dataList.forEach((r, idx) => {
    const student = r.student;
    const user = student?.user;
    const studyProgram = student?.studyProgram;
    const faculty = (studyProgram as any)?.faculty;
    const cohort = student?.cohort;
    const studentClass = (student as any)?.class;
    const raw = r.rawResponses || {};
    const primaryFollowUp = Array.isArray(r.followUps)
      ? r.followUps[0]
      : undefined;

    const rawGender = student?.gender?.toUpperCase() || "";
    const genderDisplay =
      rawGender === "L" || rawGender === "LAKI-LAKI"
        ? "Laki-laki"
        : rawGender === "P" || rawGender === "PEREMPUAN"
          ? "Perempuan"
          : "-";

    const rowData = [
      idx + 1,
      student?.nim || "-",
      user?.name || "-",
      genderDisplay,
      faculty?.name || "-",
      studyProgram?.name || "-",
      cohort?.year ? String(cohort.year) : "-",
      studentClass?.name || "-",
      r.srqScore ?? 0,
      r.priorityResult || "-",
      r.reasonCode || "-",
      r.safetyFlag ? "YA (RISIKO)" : "TIDAK",
      (raw.m1 || []).join(", ") || "-",
      primaryFollowUp?.status || "Belum dihubungi",
      r.calculatedAt ? new Date(r.calculatedAt).toLocaleString("id-ID") : "-",
    ];

    const row = sheetSummary.addRow(rowData);
    row.height = 22;

    const isEven = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Segoe UI", size: 10 };

      if (isEven) {
        cell.fill = zebraFill;
      }

      if ([3, 5, 6, 13].includes(colNumber)) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }

      if (colNumber === 9) {
        cell.numFmt = "#,##0";
      }

      // Highlighting Prioritas P1 - P4
      if (colNumber === 10) {
        const style = getPriorityStyle(r.priorityResult);
        if (style) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: style.bg },
          };
          cell.font = {
            name: "Segoe UI",
            size: 10,
            bold: true,
            color: { argb: style.font },
          };
        }
      }
    });
  });

  // Set Width Columns Sheet 2
  sheetSummary.columns = [
    { width: 6 }, // No
    { width: 16 }, // NIM
    { width: 28 }, // Nama
    { width: 15 }, // JK
    { width: 26 }, // Fakultas
    { width: 26 }, // Prodi
    { width: 12 }, // Angkatan
    { width: 12 }, // Kelas
    { width: 12 }, // Skor
    { width: 14 }, // Prioritas
    { width: 14 }, // Reason Code
    { width: 16 }, // Safety Flag
    { width: 32 }, // M1
    { width: 20 }, // Status
    { width: 22 }, // Calc Date
  ];

  // -------------------------------------------------------------
  // TRIGGER DOWNLOAD NATIVE BROWSER
  // -------------------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `${filenamePrefix}_${dateStr}.xlsx`;

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
