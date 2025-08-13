import { createDefaultApi } from "@micro-frontend/shared-utils";
import eventBus from "./eventBus";

// 创建主应用的API实例，配置token刷新和失效的回调，以及参数过滤
const api = createDefaultApi(
  {
    onTokenRefresh: (tokens) => {
      // 通知子应用token已更新
      eventBus.emit("token-refreshed", {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    },
    onTokenExpired: () => {
      // 通知子应用token已失效
      eventBus.emit("token-expired");
      // 跳转到登录页
      window.location.href = "/login";
    },
  },
  {
    keepZero: true, // 保留0值
    keepEmptyArray: false, // 过滤空数组
    keepEmptyObject: false, // 过滤空对象
  }
);

export default api;
