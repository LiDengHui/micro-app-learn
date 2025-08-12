import axios from "axios";

const API_BASE_URL = "http://localhost:9000";

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 后端统一响应格式
export interface ApiResponse<T> {
  code: number;
  data: T | null;
  errorMessage: string | null;
  timestamp: string;
  path?: string;
}

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 检查业务状态码
    const data = response.data;
    if (data.code !== 0) {
      throw new Error(data.errorMessage || "请求失败");
    }
    return data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用户相关类型定义
export interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status: number;
  roleId?: number;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  departmentId?: number;
}

export interface UpdateUserDto {
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
  roleId?: number;
  departmentId?: number;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  roleId?: number;
  departmentId?: number;
}

export interface UserListData {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserListResponse extends ApiResponse<UserListData> {}

// 用户 API
export const userApi = {
  // 获取用户列表
  getUsers: (query: UserListQuery = {}): Promise<UserListResponse> => {
    return api.get("/system/user", { params: query });
  },

  // 获取用户详情
  getUser: (id: number): Promise<ApiResponse<User>> => {
    return api.get(`/system/user/${id}`);
  },

  // 创建用户
  createUser: (data: CreateUserDto): Promise<ApiResponse<User>> => {
    return api.post("/system/user", data);
  },

  // 更新用户
  updateUser: (id: number, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    return api.patch(`/system/user/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/system/user/${id}`);
  },

  // 重置密码
  resetPassword: (
    id: number,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return api.patch(`/system/user/${id}/reset-password`, {
      password: newPassword,
    });
  },
};

export default api;
