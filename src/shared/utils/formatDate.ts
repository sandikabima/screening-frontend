export type DateInput = string | Date | number | null | undefined;

export interface FormatDateOptions {
  /** Format keluaran tanggal (Default: "SHORT_DATE") */
  variant?:
    | "SHORT_DATE"
    | "MEDIUM_DATE"
    | "FULL_DATE"
    | "DATE_TIME"
    | "FULL_DATE_TIME"
    | "MONTH_YEAR"
    | "ISO_DATE";
  /** Teks fallback jika tanggal null / invalid (Default: "-") */
  fallback?: string;
}

/**
 * Format tanggal ke standar tampilan Indonesia.
 *
 * @example
 * formatDate("2026-08-18") // "18/08/2026"
 * formatDate("2026-08-18", { variant: "MEDIUM_DATE" }) // "18 Ags 2026"
 * formatDate("2026-08-18T18:15:00", { variant: "DATE_TIME" }) // "18 Ags 2026, 18.15"
 * formatDate("2026-08-18T18:15:00", { variant: "FULL_DATE_TIME" }) // "18 Agustus 2026, 18.15.00"
 */
export const formatDate = (
  dateInput: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { variant = "SHORT_DATE", fallback = "-" } = options;

  if (!dateInput) return fallback;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return fallback;

  switch (variant) {
    case "DATE_TIME":
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

    case "FULL_DATE_TIME":
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);

    case "MEDIUM_DATE":
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);

    case "FULL_DATE":
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

    case "MONTH_YEAR":
      return new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(date);

    case "ISO_DATE":
      return date.toISOString().split("T")[0];

    case "SHORT_DATE":
    default:
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
  }
};
