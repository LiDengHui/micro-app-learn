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

// 用户相关类型定义 - 根据 nest-serve 的 User 实体
export interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  mobile?: string;
  sex?: number;
  avatar?: string;
  login_ip?: string;
  login_date?: string;
  remark?: string;
  status?: boolean;
  dept_id?: number;
  departmentId?: number;
  roleId?: number;
  department?: {
    id: number;
    name: string;
  };
  role?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  account: string;
  email?: string;
  nickname?: string;
  mobile?: string;
  sex?: number | null;
  roleId?: number | null;
  departmentId?: number | null;
  status?: boolean;
  remark?: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  account?: string;
  email?: string;
  nickname?: string;
  mobile?: string;
  sex?: number | null;
  roleId?: number | null;
  departmentId?: number | null;
  status?: boolean;
  remark?: string;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  username?: string;
  account?: string;
  departmentId?: number | null;
  roleId?: number | null;
  status?: boolean;
}

export interface UserListData {
  list: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse extends NestApiResponse<UserListData> {}

// 用户 API - 根据 nest-serve 的实际接口路径
export const userApi = {
  // 获取用户列表
  getUsers: (query: UserListQuery = {}): Promise<UserListResponse> => {
    return api.get("/admin/users", { params: query });
  },

  // 获取用户详情
  getUser: (id: number): Promise<NestApiResponse<User>> => {
    return api.get(`/admin/users/${id}`);
  },

  // 创建用户
  createUser: (data: CreateUserDto): Promise<NestApiResponse<User>> => {
    return api.post("/admin/users", data);
  },

  // 更新用户
  updateUser: (
    id: number,
    data: UpdateUserDto
  ): Promise<NestApiResponse<User>> => {
    return api.put(`/admin/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: number): Promise<NestApiResponse<void>> => {
    return api.delete(`/admin/users/${id}`);
  },
};

export default api;
