import { z } from "zod";

// Validasi re-usable untuk Phone Number (Sesuai constraint backend max 15 digit)
const phoneNumberValidation = z
  .string()
  .min(1, "Nomor telepon/WA wajib diisi")
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(
    /^[0-9+]+$/,
    "Nomor telepon hanya boleh berisi angka atau tanda + (contoh: 081234567890)",
  );

// Validasi re-usable untuk Password (1 Kapital & 1 Angka)
const passwordValidation = z
  .string()
  .min(1, "Password wajib diisi")
  .min(6, "Password akun minimal 6 karakter")
  .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar (A-Z)")
  .regex(/[0-9]/, "Password harus mengandung minimal 1 angka (0-9)");

// 1. Schema untuk Create / Registrasi Student Baru
export const createStudentSchema = z.object({
  nim: z
    .string()
    .min(1, "NIM wajib diisi")
    .min(5, "NIM minimal terdiri dari 5 karakter")
    .max(20, "NIM maksimal 20 karakter")
    .regex(/^[0-9]+$/, "NIM hanya boleh berisi angka"),

  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama lengkap minimal 3 karakter"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid (contoh: maba@campus.ac.id)"),

  password: passwordValidation,

  phoneNumber: phoneNumberValidation,

  gender: z.enum(["L", "P"], {
    message: "Pilih jenis kelamin yang valid (L/P)",
  }),

  facultyId: z.string().min(1, "Fakultas naungan wajib dipilih"),

  studyProgramId: z.string().min(1, "Program Studi wajib dipilih"),

  cohortId: z.string().min(1, "Angkatan / Cohort wajib dipilih"),

  classId: z.string().optional().nullable(),
});

// 2. Schema untuk Update Student (NIM, Email, Password tidak diubah)
export const updateStudentSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama lengkap minimal 3 karakter"),

  phoneNumber: phoneNumberValidation,

  gender: z.enum(["L", "P"], {
    message: "Pilih jenis kelamin yang valid (L/P)",
  }),

  facultyId: z.string().min(1, "Fakultas naungan wajib dipilih"),

  studyProgramId: z.string().min(1, "Program Studi wajib dipilih"),

  cohortId: z.string().min(1, "Angkatan / Cohort wajib dipilih"),

  classId: z.string().optional().nullable(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
