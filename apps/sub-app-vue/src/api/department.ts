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

// 部门相关类型定义
export interface Department {
  id: number;
  name: string;
  parentId?: number;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListQuery {
  page?: number;
  limit?: number;
  name?: string;
}

export interface DepartmentListData {
  list: Department[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DepartmentListResponse
  extends NestApiResponse<DepartmentListData> {}

// 部门 API
export const departmentApi = {
  // 获取部门列表
  getDepartments: (
    query: DepartmentListQuery = {}
  ): Promise<DepartmentListResponse> => {
    return api.get("/department", { params: query });
  },

  // 获取所有部门（用于下拉选择）
  getAllDepartments: (): Promise<NestApiResponse<Department[]>> => {
    return api.get("/department", { params: { limit: 1000 } });
  },
};

export default departmentApi;
