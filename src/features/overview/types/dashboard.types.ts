export interface DashboardOverviewStats {
  totalScreening: number;
  criticalCasesP1: number;
  highRiskCasesP2: number;
  monitoringCasesP3: number;
  normalCasesP4: number;
}

export interface DashboardFollowUpStats {
  pending: number;
  scheduled: number;
  completed: number;
  totalTickets: number;
}

export interface EmergencyCaseStudent {
  id: string;
  nim: string;
  user?: {
    name: string;
    email: string;
  };
  studyProgram?: {
    name: string;
    code: string;
  };
}

export interface RecentEmergencyCase {
  id: string;
  srqScore: number;
  priorityResult: string;
  reasonCode: string;
  calculatedAt: string;
  student?: EmergencyCaseStudent;
}

export interface DashboardStats {
  overview: DashboardOverviewStats;
  followUpStats: DashboardFollowUpStats;
  recentEmergencyCases: RecentEmergencyCase[];
}
