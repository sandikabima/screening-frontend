import { z } from "zod";

export const createScheduleSchema = z.object({
  name: z
    .string({ message: "Nama batch wajib diisi" })
    .min(3, "Nama batch minimal 3 karakter")
    .transform((val) => val.trim()),
  tanggal: z
    .string({ message: "Tanggal pelaksanaan wajib diisi" })
    .min(1, "Tanggal pelaksanaan tidak boleh kosong"),
  jamMulai: z
    .string({ message: "Jam mulai wajib diisi" })
    .min(1, "Jam mulai tidak boleh kosong"),
  jamSelesai: z
    .string({ message: "Jam selesai wajib diisi" })
    .min(1, "Jam selesai tidak boleh kosong"),
  testerId: z
    .string({ message: "Tester penanggung jawab wajib dipilih" })
    .uuid("Format ID tester tidak valid"),
  barcodeValue: z
    .string({ message: "Kode barcode wajib diisi" })
    .min(3, "Kode barcode minimal 3 karakter")
    .transform((val) => val.trim().toUpperCase()),
});

export const updateScheduleSchema = z.object({
  name: z
    .string()
    .min(3, "Nama batch minimal 3 karakter")
    .transform((val) => val.trim())
    .optional(),
  tanggal: z.string().optional(),
  jamMulai: z.string().optional(),
  jamSelesai: z.string().optional(),
  testerId: z.string().uuid("Format ID tester tidak valid").optional(),
  barcodeValue: z
    .string()
    .min(3, "Kode barcode minimal 3 karakter")
    .transform((val) => val.trim().toUpperCase())
    .optional(),
  statusBarcode: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).optional(),
});
