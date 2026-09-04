export interface SrqCutOff {
  id: string;
  cutoffScore: number;
  label: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSrqCutOffPayload {
  cutoffScore: number;
  label: string;
  description?: string;
}
