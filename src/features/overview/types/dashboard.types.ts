export interface MasterDataMetrics {
  totalRegisteredStudents: number;
  totalFaculties: number;
  totalStudyPrograms: number;
  totalClasses: number;
  totalCohorts: number;
}

export interface OverviewMetrics {
  totalScreening: number;
  criticalCasesP1: number;
  highRiskCasesP2: number;
  monitoringCasesP3: number;
  normalCasesP4: number;
}

export interface FacultyRiskDistributionItem {
  code: string;
  name: string;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  total: number;
}

export interface SymptomClustersMetrics {
  emotionalDistressF1: number;
  somaticSymptomsF2: number;
  depressiveThoughtsC1: number;
  energyDecreaseS1: number;
}

export interface MainIssueM1Item {
  label: string;
  total: number;
}

export interface FollowUpMetrics {
  pending: number;
  scheduled: number;
  completed: number;
  totalTickets: number;
}

export interface RecentEmergencyCaseItem {
  id: string;
  srqScore: number;
  priorityResult: string;
  calculatedAt: string;
  student?: {
    id: string;
    nim: string;
    phoneNumber?: string | null;
    user?: {
      name: string;
      email: string;
    } | null;
    studyProgram?: {
      name: string;
      code: string;
    } | null;
  } | null;
}

export interface DashboardOverviewResponse {
  masterData: MasterDataMetrics;
  overview: OverviewMetrics;
  facultyDistribution: FacultyRiskDistributionItem[];
  symptomClusters: SymptomClustersMetrics;
  mainIssuesM1: MainIssueM1Item[];
  followUpStats: FollowUpMetrics;
  recentEmergencyCases: RecentEmergencyCaseItem[];
}

export type DashboardStats = DashboardOverviewResponse;
