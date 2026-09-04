export interface Permission {
  id: string;
  permissionKey: string;
  name: string;
  module: string;
  createdAt?: string;
}

export interface CreatePermissionPayload {
  permissionKey: string;
  name: string;
  module: string;
}

export interface AssignPermissionPayload {
  roleId: string;
  permissionIds: string[];
}

export interface RolePermissionAssignment {
  roleId: string;
  roleName?: string;
  permissionIds: string[];
}
