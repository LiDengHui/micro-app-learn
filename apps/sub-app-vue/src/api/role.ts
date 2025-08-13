import { createApiClient } from "@micro-frontend/shared-utils";

// 创建 API 客户端
const api = createApiClient();

// nest-serve 的响应格式
export interface NestApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 角色相关类型定义
export interface Role {
  id: number;
  name: string;
  role?: string;
  remark?: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  role?: string;
  remark?: string;
  status: boolean;
}

export interface UpdateRoleDto {
  id?: number;
  name: string;
  role?: string;
  remark?: string;
  status: boolean;
}

export interface RoleListQuery {
  page?: number;
  limit?: number;
  name?: string;
}

export interface RoleListData {
  list: Role[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleListResponse extends NestApiResponse<RoleListData> {}

// 角色 API
export const roleApi = {
  // 获取角色列表
  getRoles: (query: RoleListQuery = {}): Promise<RoleListResponse> => {
    return api.get("/admin/roles", { params: query });
  },

  // 获取所有角色（用于下拉选择）
  getAllRoles: (): Promise<NestApiResponse<Role[]>> => {
    return api.get("/admin/roles", { params: { limit: 1000 } });
  },

  // 获取单个角色
  getRole: (id: number): Promise<NestApiResponse<Role>> => {
    return api.get(`/admin/roles/${id}`);
  },

  // 创建角色
  createRole: (data: CreateRoleDto): Promise<NestApiResponse<Role>> => {
    return api.post("/admin/roles", data);
  },

  // 更新角色
  updateRole: (
    id: number,
    data: UpdateRoleDto
  ): Promise<NestApiResponse<Role>> => {
    return api.put(`/admin/roles/${id}`, data);
  },

  // 删除角色
  deleteRole: (id: number): Promise<NestApiResponse<void>> => {
    return api.delete(`/admin/roles/${id}`);
  },

  // 批量删除角色
  batchDeleteRoles: (ids: number[]): Promise<NestApiResponse<void>> => {
    return api.post("/admin/roles/delete", { ids });
  },
};

export default roleApi;
