import axios from "axios";
import type {
  LoginForm,
  LoginResponse,
  RefreshTokenRequest,
  TokenResponse,
  ApiResponse,
  TokenData,
} from "../types/auth";

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

// 响应拦截器 - 处理 token 刷新
api.interceptors.response.use(
  (response) => {
    // 检查业务状态码
    const data = response.data;
    if (data.code !== 0) {
      throw new Error(data.errorMessage || "请求失败");
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const tokenResponse = await refreshTokens({ refreshToken });
          const tokens = tokenResponse.data;
          if (tokens) {
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            // 重新发送原请求
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // 刷新失败，清除 token 并跳转到登录页
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 登录
export const login = async (data: LoginForm): Promise<LoginResponse> => {
  return api.post("/auth/login", data);
};

// 获取用户信息
export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  return api.post("/auth/profile");
};

// 刷新 token
export const refreshTokens = async (
  data: RefreshTokenRequest
): Promise<TokenResponse> => {
  return api.post("/auth/refresh-token", data);
};

// 登出
export const logout = async (): Promise<ApiResponse<boolean>> => {
  return api.get("/auth/loginOut");
};

export default api;
