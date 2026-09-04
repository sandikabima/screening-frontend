import {
  LayoutDashboard,
  Brain,
  GraduationCap,
  BookOpen,
  CalendarRange,
  Users,
  Building2,
  ShieldCheck,
  FileText,
  LucideIcon,
  HelpCircle,
  AlertTriangle,
  SlidersHorizontal,
  CalendarCheck,
  QrCode,
  Activity,
  FileSpreadsheet,
} from "lucide-react";

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  permission?: string;
  badge?: string;
}

export interface MenuSection {
  header: string;
  items: MenuItem[];
}

export const SIDEBAR_SECTIONS: MenuSection[] = [
  {
    header: "DASHBOARD",
    items: [
      {
        title: "Overview",
        path: "/overview",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    header: "ACADEMIC COMMUNITY",
    items: [
      {
        title: "Student Directory",
        path: "/admin/student",
        icon: Users,
        permission: "MENU_STUDENT",
      },
    ],
  },
  {
    header: "CAMPUS MANAGEMENT",
    items: [
      {
        title: "Faculties",
        path: "/admin/faculty",
        icon: Building2,
        permission: "MENU_FACULTY",
      },
      {
        title: "Study Programs",
        path: "/admin/study",
        icon: BookOpen,
        permission: "MENU_STUDY",
      },
      {
        title: "Cohorts & Batches",
        path: "/admin/cohorts",
        icon: CalendarRange,
        permission: "MENU_COHORTS",
      },
      {
        title: "Classes",
        path: "/admin/class",
        icon: GraduationCap,
        permission: "MENU_CLASS",
      },
    ],
  },
  {
    header: "ASSESSMENT INSTRUMENTS",
    items: [
      {
        title: "SRQ-20 Questionnaire",
        path: "/admin/question",
        icon: Brain,
        permission: "MENU_QUESTION",
      },
      {
        title: "Triage Questions",
        path: "/admin/question-triage",
        icon: HelpCircle,
        permission: "MENU_QUESTION",
      },
      {
        title: "Cut-Off Configuration",
        path: "/admin/cut-off",
        icon: SlidersHorizontal,
        permission: "MENU_CUTOFF",
      },
    ],
  },
  {
    header: "SCREENING OPERATIONS",
    items: [
      {
        title: "Screening Schedules",
        path: "/admin/screening-schedule",
        icon: CalendarCheck,
        permission: "MENU_SCREENING_SCHEDULE",
      },
      {
        title: "Screening Sessions",
        path: "/admin/screening-session",
        icon: QrCode,
        permission: "MENU_SCREENING_SESSION",
      },
    ],
  },
  {
    header: "CLINICAL EVALUATION",
    items: [
      {
        title: "SRQ-20 Response",
        path: "/admin/screening-srq-20",
        icon: FileSpreadsheet,
        permission: "MENU_SCREENING_SESSION",
      },
      {
        title: "Screening Results",
        path: "/admin/screening-result",
        icon: Activity,
        permission: "MENU_SCREENING_SESSION",
      },
      {
        title: "Follow UP",
        path: "/admin/follow-up",
        icon: AlertTriangle,
        permission: "MENU_SCREENING_SESSION",
      },
    ],
  },
  {
    header: "SYSTEM & AUDIT",
    items: [
      {
        title: "Audit Logs",
        path: "/admin/audit-logs",
        icon: FileText,
        permission: "SYSTEM_SETTING",
      },
      {
        title: "Access Control",
        path: "/admin/rbac",
        icon: ShieldCheck,
        permission: "SYSTEM_SETTING",
      },
    ],
  },
];
