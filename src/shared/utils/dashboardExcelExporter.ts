import { DashboardOverviewResponse } from "@/features/overview/types/dashboard.types";
import ExcelJS from "exceljs";

export const exportDashboardToExcel = async (
  dashboardData: DashboardOverviewResponse,
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "UPT Layanan Psikologi & Difabel";
  workbook.lastModifiedBy = "Executive Dashboard System";
  workbook.created = new Date();

  // ----------------------------------------------------
  // PALET WARNA CORPORATE (ARGB)
  // ----------------------------------------------------
  const PALETTE = {
    NAVY_DARK: "FF0F172A", // Slate 900 (Header Utama)
    SLATE_BANNER: "FF1E293B", // Slate 800 (Section Banners)
    SLATE_LIGHT: "FFF8FAFC", // Slate 50 (Row Zebra)
    CARD_BG: "FFF1F5F9", // Slate 100 (Background Stat Card)
    BORDER_LIGHT: "FFE2E8F0", // Slate 200 (Soft Gridline)
    TEXT_MUTED: "FF64748B", // Slate 500 (Sub-label)
    TEXT_MAIN: "FF334155", // Slate 700 (Body Text)
  };

  const TRIAGE_BADGES = {
    P1: { bg: "FFFEE2E2", text: "FF991B1B", border: "FFFCA5A5" },
    P2: { bg: "FFFEF3C7", text: "FF92400E", border: "FFFCD34D" },
    P3: { bg: "FFDBEAFE", text: "FF1E40AF", border: "FF93C5FD" },
    P4: { bg: "FFD1FAE5", text: "FF065F46", border: "FF6EE7B7" },
  };

  const applyHeaderStyle = (cell: ExcelJS.Cell) => {
    cell.font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PALETTE.NAVY_DARK },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "medium", color: { argb: PALETTE.NAVY_DARK } },
      left: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      bottom: { style: "medium", color: { argb: PALETTE.NAVY_DARK } },
      right: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
    };
  };

  const applySectionBannerStyle = (cell: ExcelJS.Cell) => {
    cell.font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PALETTE.SLATE_BANNER },
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
  };

  const applyDataStyle = (
    cell: ExcelJS.Cell,
    isEvenRow = false,
    align: "left" | "center" | "right" = "left",
    bold = false,
  ) => {
    cell.font = {
      name: "Segoe UI",
      size: 9.5,
      bold,
      color: { argb: PALETTE.TEXT_MAIN },
    };
    if (isEvenRow) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: PALETTE.SLATE_LIGHT },
      };
    }
    cell.alignment = { vertical: "middle", horizontal: align };
    cell.border = {
      top: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      left: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      bottom: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      right: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
    };
  };

  const applyBadgeStyle = (
    cell: ExcelJS.Cell,
    priority: "P1" | "P2" | "P3" | "P4",
  ) => {
    const badge = TRIAGE_BADGES[priority];
    cell.font = {
      name: "Segoe UI",
      size: 9.5,
      bold: true,
      color: { argb: badge.text },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: badge.bg },
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      top: { style: "thin", color: { argb: badge.border } },
      left: { style: "thin", color: { argb: badge.border } },
      bottom: { style: "thin", color: { argb: badge.border } },
      right: { style: "thin", color: { argb: badge.border } },
    };
  };

  const autoFitColumns = (worksheet: ExcelJS.Worksheet, minWidth = 14) => {
    worksheet.columns.forEach((column) => {
      let maxLen = minWidth;
      column.eachCell?.({ includeEmpty: false }, (cell) => {
        const val = cell.value ? cell.value.toString() : "";
        if (val.length > maxLen && !cell.isMerged) {
          maxLen = val.length;
        }
      });
      column.width = Math.min(maxLen + 4, 50);
    });
  };

  // ====================================================
  // SHEET 1: EXECUTIVE SUMMARY
  // ====================================================
  const sheet1 = workbook.addWorksheet("Executive Summary", {
    views: [{ showGridLines: true }],
  });

  // 1. Header Judul Laporan
  sheet1.getCell("A1").value = "UNIVERSITAS BAITURRAHMAH";
  sheet1.getCell("A1").font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: PALETTE.NAVY_DARK },
  };

  sheet1.getCell("A2").value =
    "UPT LAYANAN PSIKOLOGI DAN DIFABEL — DIAGNOSTIC EXECUTIVE REPORT";
  sheet1.getCell("A2").font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF059669" },
  };

  sheet1.getCell("A3").value =
    `Dicetak Pada: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB`;
  sheet1.getCell("A3").font = {
    name: "Segoe UI",
    size: 9,
    italic: true,
    color: { argb: PALETTE.TEXT_MUTED },
  };

  // 2. Stat Cards (Pilihan Layout Eksplisit - Row 5 & Row 6)
  sheet1.getRow(5).height = 18;
  sheet1.getRow(6).height = 28;

  // Card 1: Mahasiswa
  sheet1.getCell("A5").value = "MAHASISWA TERDAFTAR";
  sheet1.getCell("A5").font = {
    name: "Segoe UI",
    size: 8.5,
    bold: true,
    color: { argb: PALETTE.TEXT_MUTED },
  };
  sheet1.getCell("A5").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("A6").value = dashboardData.masterData.totalRegisteredStudents;
  sheet1.getCell("A6").font = {
    name: "Segoe UI",
    size: 16,
    bold: true,
    color: { argb: PALETTE.NAVY_DARK },
  };
  sheet1.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("A6").numFmt = "#,##0";

  // Card 2: Screening
  sheet1.getCell("B5").value = "TOTAL SESI SCREENING";
  sheet1.getCell("B5").font = {
    name: "Segoe UI",
    size: 8.5,
    bold: true,
    color: { argb: PALETTE.TEXT_MUTED },
  };
  sheet1.getCell("B5").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("B6").value = dashboardData.overview.totalScreening;
  sheet1.getCell("B6").font = {
    name: "Segoe UI",
    size: 16,
    bold: true,
    color: { argb: "FF0284C7" },
  };
  sheet1.getCell("B6").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("B6").numFmt = "#,##0";

  // Card 3: Emergency P1
  sheet1.getCell("C5").value = "EMERGENCY CASES (P1)";
  sheet1.getCell("C5").font = {
    name: "Segoe UI",
    size: 8.5,
    bold: true,
    color: { argb: "FFDC2626" },
  };
  sheet1.getCell("C5").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("C6").value = dashboardData.overview.criticalCasesP1;
  sheet1.getCell("C6").font = {
    name: "Segoe UI",
    size: 16,
    bold: true,
    color: { argb: "FFDC2626" },
  };
  sheet1.getCell("C6").alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getCell("C6").numFmt = "#,##0";

  ["A5", "A6", "B5", "B6", "C5", "C6"].forEach((pos) => {
    const c = sheet1.getCell(pos);
    c.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PALETTE.CARD_BG },
    };
    c.border = {
      top: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      left: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      bottom: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
      right: { style: "thin", color: { argb: PALETTE.BORDER_LIGHT } },
    };
  });

  // 3. Section 1: Master Data
  sheet1.mergeCells("A8:B8");
  sheet1.getCell("A8").value = "1. METRIK DATA AKADEMIS MAHASISWA";
  applySectionBannerStyle(sheet1.getCell("A8"));
  applySectionBannerStyle(sheet1.getCell("B8"));

  const masterDataList = [
    [
      "Total Mahasiswa Registered",
      dashboardData.masterData.totalRegisteredStudents,
    ],
    ["Total Fakultas Aktif", dashboardData.masterData.totalFaculties],
    ["Total Program Studi", dashboardData.masterData.totalStudyPrograms],
    ["Total Kelas Terdaftar", dashboardData.masterData.totalClasses],
    ["Total Angkatan (Cohorts)", dashboardData.masterData.totalCohorts],
  ];

  masterDataList.forEach((r, idx) => {
    const row = sheet1.addRow([r[0], r[1]]);
    row.height = 20;
    applyDataStyle(row.getCell(1), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(2), idx % 2 === 1, "right", true);
    row.getCell(2).numFmt = "#,##0";
  });

  // 4. Section 2: Status Triage Klinis
  const startTriage = sheet1.rowCount + 2;
  sheet1.mergeCells(`A${startTriage}:C${startTriage}`);
  const triageSec = sheet1.getCell(`A${startTriage}`);
  triageSec.value = "2. DISTRIBUSI STATUS TRIAGE KLINIS (SRQ-20)";
  applySectionBannerStyle(triageSec);
  applySectionBannerStyle(sheet1.getCell(`B${startTriage}`));
  applySectionBannerStyle(sheet1.getCell(`C${startTriage}`));

  const totalScreening = dashboardData.overview.totalScreening || 1;
  const triageList = [
    [
      "Total Sesi Screening Selesai",
      dashboardData.overview.totalScreening,
      1,
      "P4",
    ],
    [
      "P1 — Emergency",
      dashboardData.overview.criticalCasesP1,
      dashboardData.overview.criticalCasesP1 / totalScreening,
      "P1",
    ],
    [
      "P2 — High Risk",
      dashboardData.overview.highRiskCasesP2,
      dashboardData.overview.highRiskCasesP2 / totalScreening,
      "P2",
    ],
    [
      "P3 — Monitoring",
      dashboardData.overview.monitoringCasesP3,
      dashboardData.overview.monitoringCasesP3 / totalScreening,
      "P3",
    ],
    [
      "P4 — Normal / Non-Klinis",
      dashboardData.overview.normalCasesP4,
      dashboardData.overview.normalCasesP4 / totalScreening,
      "P4",
    ],
  ];

  triageList.forEach((r, idx) => {
    const row = sheet1.addRow([r[0], r[1], r[2]]);
    row.height = 22;
    applyDataStyle(row.getCell(1), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(2), idx % 2 === 1, "right", true);
    applyDataStyle(row.getCell(3), idx % 2 === 1, "right");

    row.getCell(2).numFmt = "#,##0";
    row.getCell(3).numFmt = "0.0%";

    if (idx > 0) {
      applyBadgeStyle(row.getCell(1), r[3] as "P1" | "P2" | "P3" | "P4");
    }
  });

  // 5. Section 3: Indikator Gejala Utama
  const startInti = sheet1.rowCount + 2;
  sheet1.mergeCells(`A${startInti}:B${startInti}`);
  const intiSec = sheet1.getCell(`A${startInti}`);
  intiSec.value = "3. INDIKATOR GEJALA UTAMA KLINIS (INTI-01 s/d INTI-04)";
  applySectionBannerStyle(intiSec);
  applySectionBannerStyle(sheet1.getCell(`B${startInti}`));

  const intiList = [
    [
      "Dampak Akademik (INTI-01 / F1)",
      dashboardData.symptomClusters.emotionalDistressF1,
    ],
    [
      "Dampak Aktivitas Sehari-hari (INTI-02 / F2)",
      dashboardData.symptomClusters.somaticSymptomsF2,
    ],
    [
      "Kemampuan Menghadapi Masalah (INTI-03 / C1)",
      dashboardData.symptomClusters.depressiveThoughtsC1,
    ],
    [
      "Dukungan Sosial (INTI-04 / S1)",
      dashboardData.symptomClusters.energyDecreaseS1,
    ],
  ];

  intiList.forEach((r, idx) => {
    const row = sheet1.addRow([r[0], r[1]]);
    row.height = 20;
    applyDataStyle(row.getCell(1), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(2), idx % 2 === 1, "right", true);
    row.getCell(2).numFmt = "#,##0";
  });

  // Menyetel lebar kolom khusus untuk Sheet 1
  sheet1.getColumn(1).width = 46; // Kolom A cukup lebar untuk judul indikator
  sheet1.getColumn(2).width = 22;
  sheet1.getColumn(3).width = 22;

  // ====================================================
  // SHEET 2: SEBARAN FAKULTAS
  // ====================================================
  const sheet2 = workbook.addWorksheet("Sebaran Fakultas", {
    views: [{ showGridLines: true }],
  });

  const header2 = sheet2.getRow(1);
  header2.values = [
    "KODE",
    "NAMA FAKULTAS",
    "P1 (EMERGENCY)",
    "P2 (HIGH RISK)",
    "P3 (MONITORING)",
    "P4 (NORMAL)",
    "TOTAL SCREENING",
  ];
  header2.height = 28;
  header2.eachCell(applyHeaderStyle);

  dashboardData.facultyDistribution.forEach((f, idx) => {
    const row = sheet2.addRow([
      f.code,
      f.name,
      f.p1,
      f.p2,
      f.p3,
      f.p4,
      f.total,
    ]);
    row.height = 22;

    applyDataStyle(row.getCell(1), idx % 2 === 1, "center", true);
    applyDataStyle(row.getCell(2), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(3), idx % 2 === 1, "right");
    applyDataStyle(row.getCell(4), idx % 2 === 1, "right");
    applyDataStyle(row.getCell(5), idx % 2 === 1, "right");
    applyDataStyle(row.getCell(6), idx % 2 === 1, "right");
    applyDataStyle(row.getCell(7), idx % 2 === 1, "right", true);

    for (let c = 3; c <= 7; c++) {
      row.getCell(c).numFmt = "#,##0";
    }

    if (f.p1 > 0) applyBadgeStyle(row.getCell(3), "P1");
    if (f.p2 > 0) applyBadgeStyle(row.getCell(4), "P2");
  });

  autoFitColumns(sheet2, 14);

  // ====================================================
  // SHEET 3: PROFIL TAG MASALAH (M1)
  // ====================================================
  const sheet3 = workbook.addWorksheet("Profil Tag Masalah", {
    views: [{ showGridLines: true }],
  });

  const header3 = sheet3.getRow(1);
  header3.values = [
    "NO",
    "KATEGORI MASALAH UTAMA (TAG M1)",
    "TOTAL KASUS TERLAPOR",
  ];
  header3.height = 28;
  header3.eachCell(applyHeaderStyle);

  dashboardData.mainIssuesM1.forEach((item, idx) => {
    const row = sheet3.addRow([idx + 1, item.label, item.total]);
    row.height = 22;

    applyDataStyle(row.getCell(1), idx % 2 === 1, "center");
    applyDataStyle(row.getCell(2), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(3), idx % 2 === 1, "right", true);
    row.getCell(3).numFmt = "#,##0";
  });

  autoFitColumns(sheet3, 12);

  // ====================================================
  // SHEET 4: EMERGENCY STREAM (P1)
  // ====================================================
  const sheet4 = workbook.addWorksheet("Emergency Stream P1", {
    views: [{ showGridLines: true }],
  });

  const header4 = sheet4.getRow(1);
  header4.values = [
    "NIM",
    "NAMA MAHASISWA",
    "NO. WHATSAPP / HP",
    "PROGRAM STUDI",
    "SKOR SRQ",
    "PRIORITAS",
    "WAKTU KALKULASI",
  ];
  header4.height = 28;
  header4.eachCell(applyHeaderStyle);

  dashboardData.recentEmergencyCases.forEach((c, idx) => {
    const row = sheet4.addRow([
      c.student?.nim || "-",
      c.student?.user?.name || "-",
      c.student?.phoneNumber || "-",
      c.student?.studyProgram?.name || "-",
      c.srqScore,
      c.priorityResult,
      new Date(c.calculatedAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ]);
    row.height = 22;

    applyDataStyle(row.getCell(1), idx % 2 === 1, "center", true);
    applyDataStyle(row.getCell(2), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(3), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(4), idx % 2 === 1, "left");
    applyDataStyle(row.getCell(5), idx % 2 === 1, "center");
    applyDataStyle(row.getCell(6), idx % 2 === 1, "center");
    applyBadgeStyle(row.getCell(6), "P1");
    applyDataStyle(row.getCell(7), idx % 2 === 1, "center");
  });

  autoFitColumns(sheet4, 16);

  // ----------------------------------------------------
  // GENERATE & DOWNLOAD STREAM
  // ----------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Laporan_Executive_Triage_UPT_${new Date().toISOString().split("T")[0]}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
