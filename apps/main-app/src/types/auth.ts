export interface LoginForm {
  username: string;
  password: string;
}

// 后端统一响应格式
export interface ApiResponse<T> {
  code: number;
  data: T | null;
  errorMessage: string | null;
  timestamp: string;
  path?: string;
}

// 登录响应的实际数据
export interface LoginData {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

// 包装后的登录响应
export interface LoginResponse extends ApiResponse<LoginData> {}

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse extends ApiResponse<TokenData> {}
