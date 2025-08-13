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
  parent?: Department;
  children?: Department[];
  leader_user_id?: number;
  leader?: any;
  phone?: string;
  email?: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  parentId?: number;
  leader_user_id?: number;
  phone?: string;
  email?: string;
  status: boolean;
}

export interface UpdateDepartmentDto {
  id?: number;
  name: string;
  parentId?: number;
  leader_user_id?: number;
  phone?: string;
  email?: string;
  status: boolean;
}

export interface DepartmentListQuery {
  page?: number;
  limit?: number;
  name?: string;
  status?: number;
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
  // 获取部门列表（树形结构）
  getDepartments: (
    query: DepartmentListQuery = {}
  ): Promise<DepartmentListResponse> => {
    return api.get("/department", { params: query });
  },

  // 获取所有部门（用于下拉选择）
  getAllDepartments: (): Promise<NestApiResponse<Department[]>> => {
    return api.get("/department", { params: { limit: 1000 } });
  },

  // 创建部门
  createDepartment: (
    data: CreateDepartmentDto
  ): Promise<NestApiResponse<Department>> => {
    return api.post("/department/save", data);
  },

  // 更新部门
  updateDepartment: (
    data: UpdateDepartmentDto
  ): Promise<NestApiResponse<Department>> => {
    return api.post("/department/save", data);
  },

  // 删除部门
  deleteDepartment: (ids: number[]): Promise<NestApiResponse<void>> => {
    return api.post("/department/delete", { ids });
  },
};

export default departmentApi;
