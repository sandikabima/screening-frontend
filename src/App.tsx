import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { NotificationContainer } from "@/shared/components/ui/Notification";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardLayout } from "./shared/components/layout/DashboardLayout";

const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const DashboardOverviewPage = lazy(
  () => import("@/features/overview/pages/DashboardOverviewPage"),
);
const FacultyPage = lazy(
  () => import("@/features/campus/faculty/pages/FacultiesPage"),
);
const StudyPage = lazy(
  () => import("@/features/campus/study/pages/StudyProgramsPage"),
);
const CohortsPage = lazy(
  () => import("@/features/campus/cohort/pages/CohortsPage"),
);
const ClassPage = lazy(
  () => import("@/features/campus/class/pages/ClassesPage"),
);
const StudentPage = lazy(
  () => import("@/features/campus/student/pages/StudentsPage"),
);
const SrqQuestionPage = lazy(
  () => import("@/features/assesment/pages/SrqQuestionsPage"),
);
const TriageQuestionPage = lazy(
  () => import("@/features/assesment/pages/TriageQuestionsPage"),
);
const CutOffPage = lazy(() => import("@/features/cutOff/pages/SrqCutOffPage"));
const ScreeningShcedule = lazy(
  () => import("@/features/screening/pages/ScreeningSchedulesPage"),
);
const ScreeningSession = lazy(
  () => import("@/features/screeningSession/pages/ScreeningSessionsPage"),
);
const ScreeningSchedule = lazy(
  () => import("@/features/result/ScreeningResult/pages/ScreeningResultPage"),
);
const ScreeningSrqResponse = lazy(
  () => import("@/features/result/SRQ/pages/SrqResponsePage"),
);
const FollowUps = lazy(
  () => import("@/features/result/followUp/pages/FollowUpPage"),
);
const LogView = lazy(() => import("@/features/log/LogView"));
const UserManagementPage = lazy(
  () => import("@/features/rbac/UserManagementPage"),
);

export const App: React.FC = () => {
  return (
    <>
      <div className="block lg:hidden fixed inset-0 z-[9999] bg-black text-zinc-400 font-mono text-xs select-none">
        <div className="h-full w-full flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <div className="h-12 w-12 bg-red-950/80 border border-red-700 rounded-lg flex items-center justify-center text-red-500 font-black animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-xs">
            <h3 className="text-white font-black tracking-widest uppercase text-sm">
              AKSES TERBATAS
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
              RESOLUSI PERANGKAT TIDAK SESUAI
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed border-t border-zinc-900 pt-3">
            Portal Screening Kesehatan Mental memerlukan area layar minimum
            resolusi Laptop/Desktop (Min. Lebar: 1024px) untuk menjamin akurasi
            evaluasi SRQ-20 dan kerahasiaan visual data klinis.
          </p>
          <div className="text-[9px] text-zinc-600 tracking-tighter pt-4 font-mono">
            MINDCARE CORE MODULE // CLINICAL SCREENING SYSTEM 2026
          </div>
        </div>
      </div>

      <div className="hidden lg:block min-h-screen bg-black">
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen bg-black flex items-center justify-center font-mono text-xs text-zinc-500 tracking-widest animate-pulse">
                MENGHUBUNGKAN KE NODE SCREENING KESEHATAN MENTAL...
              </div>
            }
          >
            <Routes>
              <Route path={ROUTES.LOGIN} element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <DashboardLayout>
                      <DashboardOverviewPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_STUDENT" />}
                >
                  <Route
                    path={ROUTES.ACADEMIC_STUDENT}
                    element={
                      <DashboardLayout>
                        <StudentPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_FACULTY" />}
                >
                  <Route
                    path={ROUTES.CAMPUS_FACULTY}
                    element={
                      <DashboardLayout>
                        <FacultyPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_FACULTY" />}
                >
                  <Route
                    path={ROUTES.CAMPUS_FACULTY}
                    element={
                      <DashboardLayout>
                        <FacultyPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_STUDY" />}
                >
                  <Route
                    path={ROUTES.CAMPUS_STUDY}
                    element={
                      <DashboardLayout>
                        <StudyPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_COHORTS" />}
                >
                  <Route
                    path={ROUTES.CAMPUS_COHORTS}
                    element={
                      <DashboardLayout>
                        <CohortsPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={<ProtectedRoute requiredPermission="MENU_CLASS" />}
                >
                  <Route
                    path={ROUTES.CAMPUS_CLASS}
                    element={
                      <DashboardLayout>
                        <ClassPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_QUESTION" />
                  }
                >
                  <Route
                    path={ROUTES.ACADEMIC_QUESTION_SRQ}
                    element={
                      <DashboardLayout>
                        <SrqQuestionPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_QUESTION" />
                  }
                >
                  <Route
                    path={ROUTES.ACADEMIC_QUESTION_TRIAGE}
                    element={
                      <DashboardLayout>
                        <TriageQuestionPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_QUESTION" />
                  }
                >
                  <Route
                    path={ROUTES.ASSESMENT_CUT_OFF}
                    element={
                      <DashboardLayout>
                        <CutOffPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_SCREENING_SCHEDULE" />
                  }
                >
                  <Route
                    path={ROUTES.OPERATIONS_SCHEDULE}
                    element={
                      <DashboardLayout>
                        <ScreeningShcedule />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_SCREENING_SESSION" />
                  }
                >
                  <Route
                    path={ROUTES.OPERATIONS_SESSION}
                    element={
                      <DashboardLayout>
                        <ScreeningSession />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_SCREENING_SESSION" />
                  }
                >
                  <Route
                    path={ROUTES.SCREENING_SRQ_RESPONSE}
                    element={
                      <DashboardLayout>
                        <ScreeningSrqResponse />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_SCREENING_SESSION" />
                  }
                >
                  <Route
                    path={ROUTES.SCREENING_RESULT}
                    element={
                      <DashboardLayout>
                        <ScreeningSchedule />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="MENU_SCREENING_SESSION" />
                  }
                >
                  <Route
                    path={ROUTES.SCREENING_FOLLOW_UP}
                    element={
                      <DashboardLayout>
                        <FollowUps />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="SYSTEM_SETTING" />
                  }
                >
                  <Route
                    path={ROUTES.USER_LOG}
                    element={
                      <DashboardLayout>
                        <LogView />
                      </DashboardLayout>
                    }
                  />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredPermission="SYSTEM_SETTING" />
                  }
                >
                  <Route
                    path={ROUTES.USER_MANAGEMENT}
                    element={
                      <DashboardLayout>
                        <UserManagementPage />
                      </DashboardLayout>
                    }
                  />
                </Route>
              </Route>
              <Route
                path="*"
                element={<Navigate to={ROUTES.LOGIN} replace />}
              />
            </Routes>
          </Suspense>
          <NotificationContainer />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
