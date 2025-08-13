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
  code?: string;
  sort?: number;
  status?: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
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
};

export default roleApi;
