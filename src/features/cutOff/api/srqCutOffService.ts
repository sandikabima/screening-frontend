import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import { SrqCutOff, UpdateSrqCutOffPayload } from "../types/srqCutOff.types";

export const srqCutOffService = {
  /**
   * GET ACTIVE CUT-OFF CONFIGURATION
   */
  getCutOff: async (
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<SrqCutOff>> => {
    const res = await api.get<BackendResponseEnvelope<SrqCutOff>>("/cut-off", {
      signal,
    });
    return res.data;
  },

  /**
   * UPDATE CUT-OFF CONFIGURATION
   */
  updateCutOff: async (
    id: string,
    payload: UpdateSrqCutOffPayload,
  ): Promise<BackendResponseEnvelope<SrqCutOff>> => {
    const res = await api.put<BackendResponseEnvelope<SrqCutOff>>(
      `/cut-off/${id}`,
      payload,
    );
    return res.data;
  },
};

export default srqCutOffService;
