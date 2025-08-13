import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { InterceptorCallbacks, RequestConfig } from "./types.js";
declare const filterEmptyParams: (params: any) => any;
export declare const createRequestInterceptor: (filterOptions?: {
    keepZero?: boolean;
    keepEmptyArray?: boolean;
    keepEmptyObject?: boolean;
}) => (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig<any>;
export declare const createResponseInterceptor: (api: AxiosInstance, callbacks?: InterceptorCallbacks) => (((response: AxiosResponse) => AxiosResponse<any, any>) | ((error: any) => Promise<AxiosResponse<any, any>>))[];
export declare const createApiInstance: (customConfig?: Partial<RequestConfig>, callbacks?: InterceptorCallbacks, filterOptions?: {
    keepZero?: boolean;
    keepEmptyArray?: boolean;
    keepEmptyObject?: boolean;
}) => AxiosInstance;
export declare const getAuthToken: () => string | null;
export declare const getRefreshToken: () => string | null;
export declare const setAuthTokens: (accessToken: string, refreshToken: string) => void;
export declare const clearAuthTokens: () => void;
export declare const filterParams: (params: any, options?: {
    keepZero?: boolean;
    keepEmptyArray?: boolean;
    keepEmptyObject?: boolean;
}) => any;
export { filterEmptyParams };
export declare const createDefaultApi: (callbacks?: InterceptorCallbacks, filterOptions?: {
    keepZero?: boolean;
    keepEmptyArray?: boolean;
    keepEmptyObject?: boolean;
}) => AxiosInstance;
export declare const createApiClient: <T = any>(customConfig?: Partial<RequestConfig>, callbacks?: InterceptorCallbacks, filterOptions?: {
    keepZero?: boolean;
    keepEmptyArray?: boolean;
    keepEmptyObject?: boolean;
}) => {
    get: <R = T>(url: string, config?: any) => Promise<R>;
    post: <R = T>(url: string, data?: any, config?: any) => Promise<R>;
    put: <R = T>(url: string, data?: any, config?: any) => Promise<R>;
    patch: <R = T>(url: string, data?: any, config?: any) => Promise<R>;
    delete: <R = T>(url: string, config?: any) => Promise<R>;
    axios: AxiosInstance;
};
