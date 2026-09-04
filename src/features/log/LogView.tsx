import React, { useState } from "react";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { Pagination } from "@/shared/components/ui/Pagination";

// SUB-MODUL: AUDIT LOGS
import { useAuditLogs } from "../log/audit/hooks/useAuditLogs";
import { AuditTable } from "../log/audit/components/AuditTable";

// SUB-MODUL: USER SESSIONS
import { useSessions } from "../log/session/hooks/useSessions";
import { SessionManager } from "../log/session/components/SessionManager";

type LogTabKey = "audit" | "session";

export const LogView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogTabKey>("audit");

  const [visitedTabs, setVisitedTabs] = useState<Record<LogTabKey, boolean>>({
    audit: true,
    session: false,
  });

  const handleTabSwitch = (tab: LogTabKey) => {
    setActiveTab(tab);
    if (!visitedTabs[tab]) {
      setVisitedTabs((prev) => ({ ...prev, [tab]: true }));
    }
  };

  // 1. HOOK AUDIT LOGS
  const {
    auditLogs,
    loading: loadingAudit,
    search: auditSearch,
    moduleFilter,
    actionFilter,
    startDate,
    endDate,
    sortOrder,
    pagination: auditPagination,
    setSearch: setAuditSearch,
    setModuleFilter,
    setActionFilter,
    setStartDate,
    setEndDate,
    setSortOrder,
    setPage: setAuditPage,
    setLimit: setAuditLimit,
    resetFilters: resetAuditFilters,
    refetchAuditLogs,
  } = useAuditLogs(visitedTabs.audit && activeTab === "audit");

  // 2. HOOK USER SESSIONS
  const {
    sessions,
    loading: loadingSessions,
    revokingId,
    revokingOthers,
    statusFilter,
    pagination: sessionPagination,
    setStatusFilter,
    setPage: setSessionPage,
    setLimit: setSessionLimit,
    refetchSessions,
    revokeSession,
    revokeOtherSessions,
  } = useSessions(visitedTabs.session && activeTab === "session");

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* HEADER CONSOLE */}
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
              PUSAT REKAM AKTIVITAS & AUDIT KLINIS
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              Konsol Pemantauan Log Keamanan, Jejak Transaksi & Kelola Sesi
              Token Pengguna
            </p>
          </div>

          {/* DUA COUNTER DITAMPILKAN EKSPLISIT PERSIS SEPERTI USERMANAGEMENTPAGE */}
          <div className="flex shrink-0 items-center gap-3 text-xs font-bold">
            <div className="rounded border border-zinc-900 bg-black px-4 py-2 text-zinc-400">
              TOTAL JEJAK AUDIT:{" "}
              <span className="ml-1 font-bold text-white">
                {auditPagination.total} Log
              </span>
            </div>
            <div className="rounded border border-zinc-900 bg-black px-4 py-2 text-zinc-400">
              TOTAL SESI PERANGKAT:{" "}
              <span className="ml-1 font-bold text-white">
                {sessionPagination.total} Sesi
              </span>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-zinc-900 gap-1 text-xs">
          {[
            {
              key: "audit",
              label: "01. JEJAK AUDIT SISTEM",
              perm: "SYSTEM_SETTING",
            },
            {
              key: "session",
              label: "02. SESI TOKEN PENGGUNA",
              perm: "SYSTEM_SETTING",
            },
          ].map((tab) => (
            <HasPermission key={tab.key} permission={tab.perm}>
              <button
                onClick={() => handleTabSwitch(tab.key as LogTabKey)}
                className={`cursor-pointer border-b-2 px-6 py-2.5 font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.key
                    ? "border-red-600 bg-red-950/20 text-red-500"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            </HasPermission>
          ))}
        </div>
      </div>

      {/* TAB 01: AUDIT LOGS */}
      {visitedTabs.audit && (
        <div className={activeTab === "audit" ? "block space-y-4" : "hidden"}>
          <AuditTable
            auditLogs={auditLogs}
            loading={loadingAudit}
            search={auditSearch}
            moduleFilter={moduleFilter}
            actionFilter={actionFilter}
            startDate={startDate}
            endDate={endDate}
            sortOrder={sortOrder}
            pagination={auditPagination}
            onSearchChange={setAuditSearch}
            onModuleChange={setModuleFilter}
            onActionChange={setActionFilter}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSortOrderChange={setSortOrder}
            onPageChange={setAuditPage}
            onLimitChange={setAuditLimit}
            onResetFilters={resetAuditFilters}
            onRefresh={refetchAuditLogs}
          />
        </div>
      )}

      {/* TAB 02: USER SESSIONS */}
      {visitedTabs.session && (
        <div className={activeTab === "session" ? "block space-y-4" : "hidden"}>
          <SessionManager
            sessions={sessions}
            loading={loadingSessions}
            revokingId={revokingId}
            revokingOthers={revokingOthers}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onRevokeSession={revokeSession}
            onRevokeOtherSessions={revokeOtherSessions}
            onRefresh={refetchSessions}
          />

          <Pagination
            pagination={sessionPagination}
            onPageChange={setSessionPage}
            onLimitChange={setSessionLimit}
            loading={loadingSessions}
          />
        </div>
      )}
    </div>
  );
};

export default LogView;
