import { Pagination } from "@/shared/types/api";

export interface ScreeningSchedule {
  id: string;
  name: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  testerId: string;
  barcodeValue: string;
  statusBarcode: "ACTIVE" | "INACTIVE" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
  tester?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSchedulePayload {
  name: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  testerId: string;
  barcodeValue: string;
}

export interface UpdateSchedulePayload {
  name?: string;
  tanggal?: string;
  jamMulai?: string;
  jamSelesai?: string;
  testerId?: string;
  barcodeValue?: string;
  statusBarcode?: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

export interface ScheduleListData {
  schedules: ScreeningSchedule[];
  pagination?: Pagination;
}
