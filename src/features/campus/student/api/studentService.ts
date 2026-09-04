import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  CreateStudentPayload,
  Student,
  StudentListData,
  UpdateStudentPayload,
} from "../types/student.types";

export const studentService = {
  getStudents: async (
    params?: QueryParams & {
      facultyId?: string;
      studyProgramId?: string;
      cohortId?: string;
      classId?: string;
      gender?: "L" | "P";
    },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<StudentListData>> => {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };

    if (params?.search && params.search.trim() !== "") {
      queryParams.search = params.search.trim();
    }
    if (params?.facultyId?.trim()) queryParams.facultyId = params.facultyId;
    if (params?.studyProgramId?.trim())
      queryParams.studyProgramId = params.studyProgramId;
    if (params?.cohortId?.trim()) queryParams.cohortId = params.cohortId;
    if (params?.classId?.trim()) queryParams.classId = params.classId;
    if (params?.gender) queryParams.gender = params.gender;

    const res = await api.get<BackendResponseEnvelope<StudentListData>>(
      "/student",
      {
        signal,
        params: queryParams,
      },
    );
    return res.data;
  },

  getStudentById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Student>> => {
    const res = await api.get<BackendResponseEnvelope<Student>>(
      `/student/${id}`,
      { signal },
    );
    return res.data;
  },

  registerStudent: async (
    payload: CreateStudentPayload,
  ): Promise<BackendResponseEnvelope<Student>> => {
    const res = await api.post<BackendResponseEnvelope<Student>>(
      "/student",
      payload,
    );
    return res.data;
  },

  updateStudent: async (
    id: string,
    payload: UpdateStudentPayload,
  ): Promise<BackendResponseEnvelope<Student>> => {
    const res = await api.put<BackendResponseEnvelope<Student>>(
      `/student/${id}`,
      payload,
    );
    return res.data;
  },

  deleteStudent: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/student/${id}`,
    );
    return res.data;
  },
};

export default studentService;
