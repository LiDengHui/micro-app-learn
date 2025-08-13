import axios from "axios";
import omitEmpty from "omit-empty";
import { HTTP_STATUS, SHARED_CONFIG, } from "./constants.js";
// 检查是否在浏览器环境中
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
// 安全的localStorage访问
const getStorageItem = (key) => {
    if (isBrowser) {
        return localStorage.getItem(key);
    }
    return null;
};
const setStorageItem = (key, value) => {
    if (isBrowser) {
        localStorage.setItem(key, value);
    }
};
const removeStorageItem = (key) => {
    if (isBrowser) {
        localStorage.removeItem(key);
    }
};
// 过滤空值参数的工具函数
const filterEmptyParams = (params) => {
    if (!params || typeof params !== "object") {
        return params;
    }
    // 使用omitEmpty过滤空值
    return omitEmpty(params);
};
// 高级参数过滤函数，提供更细粒度的控制
const filterParamsAdvanced = (params, options) => {
    if (!params || typeof params !== "object") {
        return params;
    }
    const filtered = { ...params };
    // 遍历所有属性
    Object.keys(filtered).forEach((key) => {
        const value = filtered[key];
        // 过滤null和undefined
        if (value === null || value === undefined) {
            delete filtered[key];
            return;
        }
        // 过滤空字符串
        if (value === "") {
            delete filtered[key];
            return;
        }
        // 根据选项决定是否保留0值
        if (value === 0 && !options?.keepZero) {
            delete filtered[key];
            return;
        }
        // 根据选项决定是否保留空数组
        if (Array.isArray(value) &&
            value.length === 0 &&
            !options?.keepEmptyArray) {
            delete filtered[key];
            return;
        }
        // 根据选项决定是否保留空对象
        if (typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0 &&
            !options?.keepEmptyObject) {
            delete filtered[key];
            return;
        }
        // 递归处理嵌套对象
        if (typeof value === "object" && value !== null) {
            filtered[key] = filterParamsAdvanced(value, options);
        }
    });
    return filtered;
};
// 共享的请求拦截器
export const createRequestInterceptor = (filterOptions) => {
    return (config) => {
        const token = getStorageItem("accessToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 过滤请求参数中的空值
        if (config.params) {
            config.params = filterParamsAdvanced(config.params, filterOptions);
        }
        // 过滤请求体中的空值
        if (config.data && typeof config.data === "object") {
            config.data = filterParamsAdvanced(config.data, filterOptions);
        }
        return config;
    };
};
// 共享的响应拦截器
export const createResponseInterceptor = (api, callbacks) => {
    return [
        // 成功响应拦截器
        (response) => {
            // 不再修改返回值，保持原始的axios响应
            return response;
        },
        // 错误响应拦截器
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
                !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = getStorageItem("refreshToken");
                    if (refreshToken) {
                        // 创建临时axios实例刷新token
                        const refreshApi = axios.create({
                            baseURL: SHARED_CONFIG.API_BASE_URL,
                            timeout: SHARED_CONFIG.TIMEOUT,
                            withCredentials: SHARED_CONFIG.WITH_CREDENTIALS,
                        });
                        const tokenResponse = await refreshApi.post("/admin/auth/refresh-token", { refreshToken });
                        const tokens = tokenResponse.data.data;
                        if (tokens) {
                            setStorageItem("accessToken", tokens.accessToken);
                            setStorageItem("refreshToken", tokens.refreshToken);
                            // 调用token刷新回调
                            if (callbacks?.onTokenRefresh) {
                                callbacks.onTokenRefresh(tokens);
                            }
                            // 重新发送原请求
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                            }
                            return api(originalRequest);
                        }
                    }
                }
                catch (refreshError) {
                    // 刷新失败，清除token
                    removeStorageItem("accessToken");
                    removeStorageItem("refreshToken");
                    // 调用token失效回调
                    if (callbacks?.onTokenExpired) {
                        callbacks.onTokenExpired();
                    }
                    return Promise.reject(refreshError);
                }
            }
            // 调用响应错误回调
            if (callbacks?.onResponseError) {
                callbacks.onResponseError(error);
            }
            return Promise.reject(error);
        },
    ];
};
// 创建axios实例的工厂函数
export const createApiInstance = (customConfig, callbacks, filterOptions) => {
    const config = {
        baseURL: SHARED_CONFIG.API_BASE_URL,
        timeout: SHARED_CONFIG.TIMEOUT,
        withCredentials: SHARED_CONFIG.WITH_CREDENTIALS,
        ...customConfig,
    };
    const api = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
        headers: {
            "Content-Type": "application/json",
            ...config.headers,
        },
    });
    // 添加请求拦截器
    api.interceptors.request.use(createRequestInterceptor(filterOptions), (error) => {
        if (callbacks?.onRequestError) {
            callbacks.onRequestError(error);
        }
        return Promise.reject(error);
    });
    // 添加响应拦截器
    const [successInterceptor, errorInterceptor] = createResponseInterceptor(api, callbacks);
    api.interceptors.response.use(successInterceptor, errorInterceptor);
    return api;
};
// 导出工具函数
export const getAuthToken = () => getStorageItem("accessToken");
export const getRefreshToken = () => getStorageItem("refreshToken");
export const setAuthTokens = (accessToken, refreshToken) => {
    setStorageItem("accessToken", accessToken);
    setStorageItem("refreshToken", refreshToken);
};
export const clearAuthTokens = () => {
    removeStorageItem("accessToken");
    removeStorageItem("refreshToken");
};
// 导出参数过滤工具函数
export const filterParams = filterParamsAdvanced;
export { filterEmptyParams };
// 导出默认配置的API实例
export const createDefaultApi = (callbacks, filterOptions) => {
    return createApiInstance({}, callbacks, filterOptions);
};
// 创建新的API对象，提供get、post等方法，返回泛型T和response.data
export const createApiClient = (customConfig, callbacks, filterOptions) => {
    const axiosInstance = createApiInstance(customConfig, callbacks, filterOptions);
    return {
        get: async (url, config) => {
            const response = await axiosInstance.get(url, config);
            return response.data;
        },
        post: async (url, data, config) => {
            const response = await axiosInstance.post(url, data, config);
            return response.data;
        },
        put: async (url, data, config) => {
            const response = await axiosInstance.put(url, data, config);
            return response.data;
        },
        patch: async (url, data, config) => {
            const response = await axiosInstance.patch(url, data, config);
            return response.data;
        },
        delete: async (url, config) => {
            const response = await axiosInstance.delete(url, config);
            return response.data;
        },
        // 保留原始axios实例的访问
        axios: axiosInstance,
    };
};
