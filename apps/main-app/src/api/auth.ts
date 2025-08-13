import api from "../utils/request";
import type {
  LoginForm,
  LoginResponse,
  RefreshTokenRequest,
  TokenResponse,
  ApiResponse,
} from "../types/auth";

// 登录
export const login = async (data: LoginForm): Promise<LoginResponse> => {
  return api.post("/admin/auth/login", data);
};

// 获取用户信息
export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  return api.post("/admin/auth/profile");
};

// 刷新 token
export const refreshTokens = async (
  data: RefreshTokenRequest
): Promise<TokenResponse> => {
  return api.post("/admin/auth/refresh-token", data);
};

// 登出
export const logout = async (): Promise<ApiResponse<boolean>> => {
  return api.post("/admin/auth/logout");
};

export default api;
