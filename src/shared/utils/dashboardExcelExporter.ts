import { DashboardOverviewResponse } from "@/features/overview/types/dashboard.types";
import * as XLSX from "xlsx";

export const exportDashboardToExcel = (data: DashboardOverviewResponse) => {
  const workbook = XLSX.utils.book_new();

  // 1. SHEET 1: RINGKASAN EKSEKUTIF
  const overviewRows = [
    ["LAPORAN RINGKASAN DASHBOARD EKSEKUTIF & TRIAGE KLINIS"],
    [`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`],
    [],
    ["MASTER DATA AKADEMIS", "JUMLAH"],
    ["Total Mahasiswa Terdaftar", data.masterData.totalRegisteredStudents],
    ["Total Fakultas", data.masterData.totalFaculties],
    ["Total Program Studi", data.masterData.totalStudyPrograms],
    ["Total Kelas", data.masterData.totalClasses],
    ["Total Angkatan", data.masterData.totalCohorts],
    [],
    ["STATUS TRIAGE KLINIS (SRQ-20)", "JUMLAH KASUS", "PERSENTASE"],
    ["Total Sesi Screening Selesai", data.overview.totalScreening, "100%"],
    [
      "P1 - Emergency / Kritis",
      data.overview.criticalCasesP1,
      `${((data.overview.criticalCasesP1 / (data.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
    ],
    [
      "P2 - High Risk",
      data.overview.highRiskCasesP2,
      `${((data.overview.highRiskCasesP2 / (data.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
    ],
    [
      "P3 - Monitoring",
      data.overview.monitoringCasesP3,
      `${((data.overview.monitoringCasesP3 / (data.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
    ],
    [
      "P4 - Preventif / Normal",
      data.overview.normalCasesP4,
      `${((data.overview.normalCasesP4 / (data.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
    ],
    [],
    ["TIKET INTERVENSI KLINIS", "JUMLAH TIKET"],
    ["Belum Ditangani (Pending)", data.followUpStats.pending],
    ["Dijadwalkan (Konseling Aktif)", data.followUpStats.scheduled],
    ["Selesai (Closed)", data.followUpStats.completed],
    ["Total Tiket", data.followUpStats.totalTickets],
  ];

  const sheetOverview = XLSX.utils.aoa_to_sheet(overviewRows);
  XLSX.utils.book_append_sheet(workbook, sheetOverview, "Ringkasan Eksekutif");

  // 2. SHEET 2: DISTRIBUSI RISIKO FAKULTAS
  const facultyHeaders = [
    [
      "Kode",
      "Nama Fakultas",
      "P1 (Emergency)",
      "P2 (High Risk)",
      "P3 (Monitoring)",
      "P4 (Normal)",
      "Total Screening",
    ],
  ];
  const facultyData = data.facultyDistribution.map((f) => [
    f.code,
    f.name,
    f.p1,
    f.p2,
    f.p3,
    f.p4,
    f.total,
  ]);
  const sheetFaculty = XLSX.utils.aoa_to_sheet([
    ...facultyHeaders,
    ...facultyData,
  ]);
  XLSX.utils.book_append_sheet(workbook, sheetFaculty, "Sebaran Fakultas");

  // 3. SHEET 3: SEBARAN INDIKATOR & PROFIL TAG (M1)
  const m1Headers = [["No", "Kategori Masalah Utama (M1)", "Total Kasus"]];
  const m1Data = data.mainIssuesM1.map((item, idx) => [
    idx + 1,
    item.label,
    item.total,
  ]);
  const sheetM1 = XLSX.utils.aoa_to_sheet([...m1Headers, ...m1Data]);
  XLSX.utils.book_append_sheet(workbook, sheetM1, "Profil Tag Masalah");

  // 4. SHEET 4: FEED EMERGENCY P1 TERBARU
  const emergencyHeaders = [
    [
      "NIM",
      "Nama Mahasiswa",
      "Program Studi",
      "Skor SRQ",
      "Prioritas",
      "Waktu Kalkulasi",
    ],
  ];
  const emergencyData = data.recentEmergencyCases.map((c) => [
    c.student?.nim || "-",
    c.student?.user?.name || "-",
    c.student?.studyProgram?.name || "-",
    c.srqScore,
    c.priorityResult,
    new Date(c.calculatedAt).toLocaleString("id-ID"),
  ]);
  const sheetEmergency = XLSX.utils.aoa_to_sheet([
    ...emergencyHeaders,
    ...emergencyData,
  ]);
  XLSX.utils.book_append_sheet(workbook, sheetEmergency, "Emergency Stream P1");

  // EXPORT FILE
  const filename = `Laporan_Dashboard_Triage_UPT_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
