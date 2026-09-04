import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Save, Check, CheckSquare, Square } from "lucide-react";
import { Role } from "../../role/types/role.types";
import { Permission, AssignPermissionPayload } from "../types/permission.types";
import { Button } from "@/shared/components/ui/Button";
import { Select } from "@/shared/components/ui/Select";

interface PermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  loadingPermissions: boolean;
  submitting: boolean;
  onFetchRolePermissions: (roleId: string) => Promise<Permission[]>;
  onAssign: (payload: AssignPermissionPayload) => Promise<any>;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roles,
  permissions,
  loadingPermissions,
  submitting,
  onFetchRolePermissions,
  onAssign,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [loadingRolePerms, setLoadingRolePerms] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (selectedRoleId) {
      setLoadingRolePerms(true);
      onFetchRolePermissions(selectedRoleId)
        .then((rolePerms) => {
          const ids = rolePerms.map((p) => p.id);
          setSelectedPermissionIds(ids);
          setIsDirty(false);
        })
        .catch(() => setSelectedPermissionIds([]))
        .finally(() => setLoadingRolePerms(false));
    }
  }, [selectedRoleId, onFetchRolePermissions]);

  const roleOptions = useMemo(() => {
    return roles.map((r) => ({
      value: r.id,
      label: r.name,
    }));
  }, [roles]);

  const groupedPermissions = useMemo(() => {
    const map = new Map<string, Permission[]>();
    permissions.forEach((perm) => {
      const mod = perm.module || "SYSTEM_SETTING";
      if (!map.has(mod)) map.set(mod, []);
      map.get(mod)!.push(perm);
    });
    return Array.from(map.entries()).map(([moduleName, items]) => ({
      moduleName,
      items,
    }));
  }, [permissions]);

  const handleToggle = (permId: string) => {
    setSelectedPermissionIds((prev) => {
      const next = prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId];
      setIsDirty(true);
      return next;
    });
  };

  const handleToggleModule = useCallback((moduleItems: Permission[]) => {
    const moduleIds = moduleItems.map((item) => item.id);
    setSelectedPermissionIds((prev) => {
      const allSelected = moduleIds.every((id) => prev.includes(id));
      let next: string[];
      if (allSelected) {
        next = prev.filter((id) => !moduleIds.includes(id));
      } else {
        next = Array.from(new Set([...prev, ...moduleIds]));
      }
      setIsDirty(true);
      return next;
    });
  }, []);

  const handleSave = async () => {
    if (!selectedRoleId) return;
    const res = await onAssign({
      roleId: selectedRoleId,
      permissionIds: selectedPermissionIds,
    });
    if (res?.success) {
      setIsDirty(false);
    }
  };

  return (
    <div className="space-y-4 font-mono select-none w-full">
      {/* TOOLBAR CONTAINER */}
      <div className="bg-black/80 p-4 border border-zinc-900 rounded-lg space-y-3 shadow-xl w-full overflow-hidden">
        {/* TITLE & UNSAVED BADGE */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              ASSIGN OTORITAS UNTUK ROLE
            </h2>
          </div>
          {isDirty && (
            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 rounded uppercase animate-pulse">
              ADA PERUBAHAN BELUM DISIMPAN
            </span>
          )}
        </div>

        {/* TOOLBAR CONTENT: SELECT ROLE & BUTTON SAVE */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-zinc-500 uppercase shrink-0">
              TARGET ROLE:
            </span>
            <div className="w-full sm:w-60">
              <Select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                options={roleOptions}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            loading={submitting}
            disabled={submitting || !isDirty || loadingRolePerms}
            onClick={handleSave}
            className="w-full sm:w-auto shrink-0 justify-center"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? "MENYIMPAN..." : "SIMPAN HAK AKSES"}
          </Button>
        </div>
      </div>

      {/* MATRIX PERMISSION CONTAINER */}
      <div className="border border-zinc-900 rounded-lg p-4 bg-black w-full shadow-2xl space-y-6">
        {loadingPermissions || loadingRolePerms ? (
          <div className="text-center py-12 text-zinc-600 text-xs animate-pulse uppercase tracking-widest font-bold">
            SINKRONISASI HAK AKSES PERAN...
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-xs uppercase tracking-widest font-bold">
            TIDAK ADA DATA PERMISSION DITEMUKAN.
          </div>
        ) : (
          groupedPermissions.map(({ moduleName, items }) => {
            const isAllModuleSelected = items.every((item) =>
              selectedPermissionIds.includes(item.id),
            );

            return (
              <div key={moduleName} className="space-y-3">
                {/* HEADER MODUL & BUTTON SELECT ALL */}
                <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-zinc-900 text-red-500 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      MODUL: {moduleName}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-bold">
                      (
                      {
                        items.filter((i) =>
                          selectedPermissionIds.includes(i.id),
                        ).length
                      }{" "}
                      / {items.length} DIAKTIFKAN)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleModule(items)}
                    className="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  >
                    {isAllModuleSelected ? (
                      <>
                        <Square className="h-3 w-3 text-red-500" /> BATALKAN
                        SEMUA
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-3 w-3 text-emerald-500" />{" "}
                        PILIH SEMUA
                      </>
                    )}
                  </button>
                </div>

                {/* GRID ITEM PERMISSION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {items.map((perm) => {
                    const isChecked = selectedPermissionIds.includes(perm.id);

                    return (
                      <div
                        key={perm.id}
                        onClick={() => handleToggle(perm.id)}
                        className={`p-3 border rounded cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isChecked
                            ? "bg-emerald-950/20 border-emerald-900/80 text-emerald-300"
                            : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs uppercase text-zinc-200">
                            {perm.permissionKey}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                            {perm.name}
                          </div>
                        </div>

                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-400 text-black"
                              : "border-zinc-800 bg-zinc-900"
                          }`}
                        >
                          {isChecked && (
                            <Check className="h-3 w-3 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PermissionMatrix;
