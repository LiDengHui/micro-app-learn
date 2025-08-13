export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}
export interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}
export interface TokenResponse extends ApiResponse<TokenData> {
}
export interface LoginForm {
    username: string;
    password: string;
}
export interface LoginResponse extends ApiResponse<{
    user: any;
    tokens: TokenData;
}> {
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface RequestConfig {
    baseURL?: string;
    timeout?: number;
    withCredentials?: boolean;
    headers?: Record<string, string>;
}
export interface InterceptorCallbacks {
    onTokenRefresh?: (tokens: TokenData) => void;
    onTokenExpired?: () => void;
    onRequestError?: (error: any) => void;
    onResponseError?: (error: any) => void;
}
