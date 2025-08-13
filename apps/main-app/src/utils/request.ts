import { createApiClient } from "@micro-frontend/shared-utils";

// 创建主应用的API实例，配置token刷新和失效的回调，以及参数过滤
const api = createApiClient({});

export default api;
