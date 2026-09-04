import React, { useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Pagination } from "@/shared/components/ui/Pagination";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { HasPermission } from "@/features/auth/components/HasPermission";

// MODUL 1: USER DIRECTORY
import { useUsers } from "./user/hooks/useUsers";
import { UserTable } from "./user/components/UserTable";
import { UserModal } from "./user/components/UserModal";
import { User } from "./user/types/user.types";

// MODUL 2: ROLE MANAGEMENT
import { useRoles } from "./role/hooks/useRoles";
import { RoleTable } from "./role/components/RoleTable";
import { RoleModal } from "./role/components/RoleModal";
import { Role } from "./role/types/role.types";

// MODUL 3: PERMISSION MATRIX & MANAGER
import { usePermissions } from "./permission/hooks/usePermission";
import { PermissionMatrix } from "./permission/components/PermissionMatrix";
import { PermissionManager } from "./permission/components/PermissionManager";
import { Permission } from "./permission/types/permission.types";

type TabKey = "users" | "roles" | "assign";

export const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("users");

  const [visitedTabs, setVisitedTabs] = useState<Record<TabKey, boolean>>({
    users: true,
    roles: false,
    assign: false,
  });

  const handleTabSwitch = (tab: TabKey) => {
    setActiveTab(tab);
    if (!visitedTabs[tab]) {
      setVisitedTabs((prev) => ({ ...prev, [tab]: true }));
    }
  };

  // MODAL STATES FOR USERS
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // MODAL STATES FOR ROLES
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // DELETE STATE FOR PERMISSION
  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);

  // 1. HOOK USERS
  const {
    users,
    loading: loadingUsers,
    submitting: submittingUser,
    deletingId: deletingUserId,
    search: userSearch,
    pagination: userPagination,
    setSearch: setUserSearch,
    setPage: setUserPage,
    setLimit: setUserLimit,
    refetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  } = useUsers(visitedTabs.users && activeTab === "users");

  // 2. HOOK ROLES
  const {
    roles,
    loading: loadingRoles,
    submitting: submittingRole,
    deletingId: deletingRoleId,
    search: roleSearch,
    pagination: rolePagination,
    setSearch: setRoleSearch,
    setPage: setRolePage,
    setLimit: setRoleLimit,
    refetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles(
    activeTab === "roles" || activeTab === "assign" || isUserModalOpen,
  );

  // 3. HOOK PERMISSIONS
  const {
    masterPermissions,
    loadingPermissions,
    submittingAssign,
    deletingId: deletingPermissionId,
    fetchRolePermissions,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissions,
  } = usePermissions(visitedTabs.assign && activeTab === "assign");

  return (
    <div className="space-y-6 font-mono select-none w-full">
      {/* HEADER CONSOLE */}
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-white tracking-wider uppercase flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626] animate-pulse shrink-0" />
              PUSAT MANAJEMEN AKSES & OTORITAS
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              Konsol Pengaturan Direktori Pengguna & Otoritas Hak Akses
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <div className="bg-black border border-zinc-900 px-4 py-2 rounded text-zinc-400">
              TOTAL TERDAFTAR:{" "}
              <span className="text-white ml-1 font-bold">
                {userPagination.total} Akun
              </span>
            </div>
            <div className="bg-black border border-zinc-900 px-4 py-2 rounded text-zinc-400">
              MASTER PERMISSION:{" "}
              <span className="text-white ml-1 font-bold">
                {masterPermissions.length} Item
              </span>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER (3 TABS ONLY) */}
        <div className="flex border-b border-zinc-900 gap-1 text-xs">
          {[
            {
              key: "users",
              label: "01. DIREKTORI USER",
              perm: "SYSTEM_SETTING",
            },
            { key: "roles", label: "02. SKEMA PERAN", perm: "SYSTEM_SETTING" },
            {
              key: "assign",
              label: "03. OTORITAS HAK AKSES",
              perm: "SYSTEM_SETTING",
            },
          ].map((tab) => (
            <HasPermission key={tab.key} permission={tab.perm}>
              <button
                onClick={() => handleTabSwitch(tab.key as TabKey)}
                className={`px-6 py-2.5 font-bold tracking-wider uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === tab.key
                    ? "border-red-600 text-red-500 bg-red-950/20"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            </HasPermission>
          ))}
        </div>
      </div>

      {/* TAB 01: USER DIRECTORY */}
      {visitedTabs.users && (
        <div className={activeTab === "users" ? "block space-y-4" : "hidden"}>
          <div className="flex items-center justify-between gap-4 bg-black/80 p-3.5 border border-zinc-900 rounded-lg">
            <div className="flex items-center gap-2 w-1/3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Pencarian berdasarkan nama atau email resmi..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-zinc-950/80 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
              <button
                onClick={refetchUsers}
                disabled={loadingUsers}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                title="Refresh Data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loadingUsers ? "animate-spin text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            <HasPermission permission="SYSTEM_SETTING">
              <button
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Plus className="h-4 w-4" />
                REGISTRASI USER BARU
              </button>
            </HasPermission>
          </div>

          <UserTable
            users={users}
            loading={loadingUsers}
            deletingId={deletingUserId}
            onEdit={(u) => {
              setUserToEdit(u);
              setIsUserModalOpen(true);
            }}
            onDelete={(u) => setUserToDelete(u)}
            onToggleStatus={toggleUserStatus}
          />

          <Pagination
            pagination={userPagination}
            onPageChange={setUserPage}
            onLimitChange={setUserLimit}
            loading={loadingUsers}
          />
        </div>
      )}

      {/* TAB 02: SKEMA PERAN */}
      {visitedTabs.roles && (
        <div className={activeTab === "roles" ? "block space-y-4" : "hidden"}>
          <div className="flex items-center justify-between gap-4 bg-black/80 p-3.5 border border-zinc-900 rounded-lg">
            <div className="flex items-center gap-2 w-1/3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Cari skema peran jabatan..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-zinc-950/80 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
              <button
                onClick={refetchRoles}
                disabled={loadingRoles}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                title="Refresh Data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loadingRoles ? "animate-spin text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            <HasPermission permission="SYSTEM_SETTING">
              <button
                onClick={() => {
                  setRoleToEdit(null);
                  setIsRoleModalOpen(true);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Plus className="h-4 w-4" />
                TAMBAH PERAN BARU
              </button>
            </HasPermission>
          </div>

          <RoleTable
            roles={roles}
            loading={loadingRoles}
            deletingId={deletingRoleId}
            onEdit={(r) => {
              setRoleToEdit(r);
              setIsRoleModalOpen(true);
            }}
            onDelete={(r) => setRoleToDelete(r)}
          />

          <Pagination
            pagination={rolePagination}
            onPageChange={setRolePage}
            onLimitChange={setRoleLimit}
            loading={loadingRoles}
          />
        </div>
      )}

      {/* TAB 03: OTORITAS HAK AKSES (MANAGER & MATRIX SIDE-BY-SIDE) */}
      {visitedTabs.assign && (
        <div className={activeTab === "assign" ? "block space-y-6" : "hidden"}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <PermissionManager
              permissions={masterPermissions}
              loading={loadingPermissions}
              submitting={submittingAssign}
              deletingId={deletingPermissionId}
              onCreate={createPermission}
              onUpdate={updatePermission}
              onDelete={(p) => setPermissionToDelete(p)}
            />

            <PermissionMatrix
              roles={roles}
              permissions={masterPermissions}
              loadingPermissions={loadingPermissions}
              submitting={submittingAssign}
              onFetchRolePermissions={fetchRolePermissions}
              onAssign={assignPermissions}
            />
          </div>
        </div>
      )}

      {/* MODALS REGISTRASI & EDIT USER */}
      <UserModal
        isOpen={isUserModalOpen}
        submitting={submittingUser}
        initialData={userToEdit}
        roles={roles}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSubmit={async (data) => {
          if (userToEdit) return await updateUser(userToEdit.id, data);
          return await createUser(data);
        }}
      />

      {/* MODAL ROLE */}
      <RoleModal
        isOpen={isRoleModalOpen}
        submitting={submittingRole}
        initialData={roleToEdit}
        onClose={() => {
          setIsRoleModalOpen(false);
          setRoleToEdit(null);
        }}
        onSubmit={async (data) => {
          if (roleToEdit) return await updateRole(roleToEdit.id, data);
          return await createRole(data);
        }}
      />

      {/* CONFIRM MODAL: DELETE USER */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Konfirmasi Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus pengguna "${
          userToDelete?.name || userToDelete?.email
        }" secara permanen?`}
        isSubmitting={Boolean(deletingUserId)}
        onClose={() => setUserToDelete(null)}
        onConfirm={async () => {
          if (userToDelete) {
            const res = await deleteUser(userToDelete.id);
            if (res.success) setUserToDelete(null);
          }
        }}
      />

      {/* CONFIRM MODAL: DELETE ROLE */}
      <ConfirmModal
        isOpen={Boolean(roleToDelete)}
        title="Konfirmasi Hapus Peran"
        description={`Apakah Anda yakin ingin menghapus skema peran "${
          roleToDelete?.displayName || roleToDelete?.name
        }"?`}
        isSubmitting={Boolean(deletingRoleId)}
        onClose={() => setRoleToDelete(null)}
        onConfirm={async () => {
          if (roleToDelete) {
            const res = await deleteRole(roleToDelete.id);
            if (res.success) setRoleToDelete(null);
          }
        }}
      />

      {/* CONFIRM MODAL: DELETE PERMISSION */}
      <ConfirmModal
        isOpen={Boolean(permissionToDelete)}
        title="Konfirmasi Hapus Master Permission"
        description={`Apakah Anda yakin ingin menghapus otoritas "${
          permissionToDelete?.name || permissionToDelete?.permissionKey
        }"? Tindakan ini akan melepas hak akses tersebut dari seluruh peran terikat.`}
        isSubmitting={Boolean(deletingPermissionId)}
        onClose={() => setPermissionToDelete(null)}
        onConfirm={async () => {
          if (permissionToDelete) {
            const res = await deletePermission(permissionToDelete.id);
            if (res.success) setPermissionToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default UserManagementPage;
