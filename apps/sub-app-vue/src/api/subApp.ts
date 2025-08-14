import { createApiClient } from "@micro-frontend/shared-utils";

// ==================== 类型定义 ====================

/**
 * 子应用信息接口
 */
export interface SubAppInfo {
  id: number;
  name: string; // 应用名称
  code: string; // 应用代码，唯一标识，创建后不可修改
  version: string; // 版本号
  description?: string; // 描述
  packagePath: string; // 包文件路径
  configPath?: string; // 配置文件路径
  entryPoint?: string; // 入口文件
  config?: Record<string, any> | null; // 配置信息
  status: "active" | "inactive" | "maintenance"; // 应用状态
  fileSize?: string | null; // 文件大小
  checksum?: string | null; // 文件校验和
  appKey?: string; // 应用密钥，用于校验，可以重新生成
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  sort?: number; // 排序
  creator?: string; // 创建者
  updater?: string; // 更新者
  isDeleted?: boolean; // 是否删除
}

/**
 * 子应用列表响应接口
 */
export interface SubAppListResponse {
  code: number;
  message: string;
  data: {
    list: SubAppInfo[];
    total: number;
  };
  timestamp?: number;
}

/**
 * 上传响应接口
 */
export interface UploadResponse {
  code: number;
  message: string;
  data: SubAppInfo;
}

/**
 * 删除响应接口
 */
export interface DeleteResponse {
  code: number;
  message: string;
  data: boolean;
}

/**
 * 查询参数接口
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  name?: string;
  appStatus?: string;
}

/**
 * 子应用版本历史信息接口
 */
export interface SubAppVersion {
  id: number;
  subAppId: number; // 关联的子应用ID
  version: string; // 版本号
  description?: string; // 版本描述
  packagePath: string; // 包文件路径
  configPath?: string; // 配置文件路径
  entryPoint?: string; // 入口文件
  config?: Record<string, any> | null; // 配置信息
  fileSize?: string | null; // 文件大小
  checksum?: string | null; // 文件校验和
  status: "active" | "inactive" | "deprecated"; // 版本状态
  isCurrentVersion: boolean; // 是否为当前版本
  releaseNotes?: string; // 发布说明
  createdAt?: string; // 创建时间
  creator?: string; // 创建者
  updater?: string; // 更新者
  updatedAt?: string; // 更新时间
}

/**
 * 子应用版本历史列表响应接口
 */
export interface SubAppVersionListResponse {
  code: number;
  message: string;
  data: {
    list: SubAppVersion[];
    total: number;
  };
  timestamp?: number;
}

/**
 * 版本查询参数接口
 */
export interface VersionQueryParams {
  page?: number;
  limit?: number;
  version?: string;
  status?: string;
  isCurrentVersion?: boolean;
}

// ==================== API 配置 ====================

// 创建子应用的API客户端，使用共享工具包
const api = createApiClient(
  {
    baseURL: "http://localhost:9000/admin",
    timeout: 30000,
  },
  {
    onTokenRefresh: (tokens: any) => {
      console.log("子应用收到token刷新通知:", tokens);
      // 可以在这里处理子应用特定的token刷新逻辑
    },
    onTokenExpired: () => {
      console.log("子应用收到token失效通知");
      // 可以在这里处理子应用特定的token失效逻辑
      // 比如显示提示信息或跳转到登录页
    },
  },
  {
    keepZero: true, // 保留0值
    keepEmptyArray: false, // 过滤空数组
    keepEmptyObject: false, // 过滤空对象
  }
);

// ==================== API 方法 ====================

/**
 * 获取子应用列表
 */
export const getSubAppList = async (
  params: QueryParams = {}
): Promise<SubAppListResponse> => {
  const response = await api.get("/subapps", {
    params: {
      page: params.page,
      limit: params.limit,
      name: params.name,
      appStatus: params.appStatus,
    },
  });
  return response;
};

/**
 * 上传子应用zip包
 */
export const uploadSubApp = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/subapps/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * 删除子应用
 */
export const deleteSubApp = async (id: string): Promise<DeleteResponse> => {
  const response = await api.delete(`/subapps/${id}`);
  return response;
};

/**
 * 更新子应用状态
 */
export const updateSubAppStatus = async (
  id: string,
  status: "active" | "inactive" | "maintenance"
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.patch(`/subapps/${id}/status`, { status });
  return response;
};

/**
 * 获取子应用详情
 */
export const getSubAppDetail = async (
  id: string
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.get(`/subapps/${id}`);
  return response;
};

/**
 * 获取子应用配置
 */
export const getSubAppConfig = async (
  id: string
): Promise<{ code: number; message: string; data: Record<string, any> }> => {
  const response = await api.get(`/subapps/${id}/config`);
  return response;
};

/**
 * 给已有子应用上传新版本包
 */
export const uploadSubAppById = async (
  id: string,
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/subapps/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * 新建子应用（不带包）
 */
export const createSubApp = async (
  payload: Partial<SubAppInfo>
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.post(`/subapps`, payload);
  return response;
};

/**
 * 更新子应用信息
 */
export const updateSubAppInfo = async (
  id: string,
  payload: Partial<SubAppInfo>
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.patch(`/subapps/${id}`, payload);
  return response;
};

/**
 * 生成或重新生成 appKey
 */
export const generateAppKey = async (
  id: string
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.post(`/subapps/${id}/generate-app-key`);
  return response;
};

/**
 * 验证 appKey 是否与 code 匹配
 */
export const validateAppKey = async (
  code: string,
  appKey: string
): Promise<{ code: number; message: string; data: { isValid: boolean } }> => {
  const response = await api.post("/subapps/validate-app-key", {
    code,
    appKey,
  });
  return response;
};

// ==================== 版本历史相关API ====================

/**
 * 获取子应用版本历史列表
 */
export const getSubAppVersions = async (
  subAppId: string,
  params: VersionQueryParams = {}
): Promise<SubAppVersionListResponse> => {
  const response = await api.get(`/subapps/${subAppId}/versions`, {
    params: {
      page: params.page,
      limit: params.limit,
      version: params.version,
      status: params.status,
      isCurrentVersion: params.isCurrentVersion,
    },
  });
  return response;
};

/**
 * 获取子应用版本详情
 */
export const getSubAppVersionDetail = async (
  subAppId: string,
  versionId: string
): Promise<{ code: number; message: string; data: SubAppVersion }> => {
  const response = await api.get(`/subapps/${subAppId}/versions/${versionId}`);
  return response;
};

/**
 * 部署指定版本
 */
export const deployVersion = async (
  subAppId: string,
  versionId: string
): Promise<{ code: number; message: string; data: SubAppInfo }> => {
  const response = await api.post(
    `/subapps/${subAppId}/versions/${versionId}/deploy`
  );
  return response;
};

/**
 * 删除指定版本
 */
export const deleteSubAppVersion = async (
  subAppId: string,
  versionId: string
): Promise<{ code: number; message: string; data: boolean }> => {
  const response = await api.delete(
    `/subapps/${subAppId}/versions/${versionId}`
  );
  return response;
};

/**
 * 更新版本状态
 */
export const updateVersionStatus = async (
  subAppId: string,
  versionId: string,
  status: "active" | "inactive" | "deprecated"
): Promise<{ code: number; message: string; data: SubAppVersion }> => {
  const response = await api.patch(
    `/subapps/${subAppId}/versions/${versionId}/status`,
    { status }
  );
  return response;
};
