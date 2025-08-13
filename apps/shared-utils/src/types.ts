// 基础API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Token相关类型
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface TokenResponse extends ApiResponse<TokenData> {}

// 登录相关类型
export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse
  extends ApiResponse<{
    user: any;
    tokens: TokenData;
  }> {}

// 刷新Token请求类型
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 请求配置类型
export interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

// 拦截器回调类型
export interface InterceptorCallbacks {
  onTokenRefresh?: (tokens: TokenData) => void;
  onTokenExpired?: () => void;
  onRequestError?: (error: any) => void;
  onResponseError?: (error: any) => void;
}
