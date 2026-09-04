export interface ParsedApiError {
  message: string;
  code: number;
  fieldErrors?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseApiError = (error: any): ParsedApiError => {
  if (error?.response?.data) {
    const data = error.response.data;
    return {
      message:
        data.meta?.message ||
        data.message ||
        "Terjadi kesalahan pada permintaan API.",
      code: data.meta?.code || error.response.status || 500,
      fieldErrors: Array.isArray(data.data)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.data.reduce((acc: Record<string, string>, errItem: any) => {
            if (errItem.field && errItem.message) {
              acc[errItem.field] = errItem.message;
            }
            return acc;
          }, {})
        : undefined,
    };
  }

  return {
    message:
      error?.message || "Koneksi ke server gagal. Periksa jaringan Anda.",
    code: 500,
  };
};
