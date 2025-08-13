# @micro-frontend/shared-utils

微前端架构的共享请求工具库，解决主应用和子应用之间无法直接共享axios实例的问题。

## 特性

- ✅ **统一配置**：所有应用使用相同的axios配置和拦截器
- ✅ **自动认证**：请求时自动添加token认证
- ✅ **自动刷新**：401错误时自动刷新token
- ✅ **事件通知**：通过回调函数实现应用间通信
- ✅ **类型安全**：完整的TypeScript支持
- ✅ **环境兼容**：支持浏览器和SSR环境
- ✅ **参数过滤**：自动过滤空值参数（null、undefined、空字符串）

## 安装

### 在项目中安装

```bash
# 在主应用中安装
cd apps/main-app
npm install file:../shared-utils

# 在子应用中安装
cd apps/sub-app-vue
npm install file:../shared-utils
```

## 使用方法

### 主应用配置

```typescript
// apps/main-app/src/utils/request.ts
import { createDefaultApi } from "@micro-frontend/shared-utils";
import eventBus from "./eventBus";

const api = createDefaultApi(
  {
    onTokenRefresh: (tokens) => {
      // 通知子应用token已更新
      eventBus.emit("token-refreshed", tokens);
    },
    onTokenExpired: () => {
      // 通知子应用token已失效
      eventBus.emit("token-expired");
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
```

### 子应用配置

```typescript
// apps/sub-app-vue/src/api/subApp.ts
import { createApiInstance } from "@micro-frontend/shared-utils";

const api = createApiInstance(
  {
    baseURL: "http://localhost:9000/admin",
    timeout: 30000,
  },
  {
    onTokenRefresh: (tokens) => {
      console.log("子应用收到token刷新通知:", tokens);
    },
    onTokenExpired: () => {
      console.log("子应用收到token失效通知");
    },
  },
  {
    keepZero: true, // 保留0值
    keepEmptyArray: false, // 过滤空数组
    keepEmptyObject: false, // 过滤空对象
  }
);

// 使用API实例
export const getSubAppList = async (params: QueryParams = {}) => {
  const response = await api.get("/subapps", { params });
  return response; // 已经通过拦截器处理过
};
```

## 参数过滤功能

### 自动过滤

工具库会自动过滤以下空值：
- `null` 值
- `undefined` 值
- 空字符串 `""`
- 空数组 `[]`（可选）
- 空对象 `{}`（可选）

### 过滤选项

```typescript
interface FilterOptions {
  keepZero?: boolean;        // 是否保留0值，默认false
  keepEmptyArray?: boolean;  // 是否保留空数组，默认false
  keepEmptyObject?: boolean; // 是否保留空对象，默认false
}
```

### 使用示例

```typescript
// 原始参数
const params = {
  name: "test",
  age: 25,
  email: "",           // 会被过滤
  phone: null,         // 会被过滤
  address: undefined,  // 会被过滤
  score: 0,           // 根据keepZero选项决定
  tags: [],           // 根据keepEmptyArray选项决定
  settings: {},       // 根据keepEmptyObject选项决定
};

// 过滤后的参数
const filtered = {
  name: "test",
  age: 25,
  score: 0,           // 如果keepZero: true
};
```

### 手动过滤

```typescript
import { filterParams, filterEmptyParams } from "@micro-frontend/shared-utils";

// 使用基础过滤（使用omit-empty包）
const basicFiltered = filterEmptyParams(params);

// 使用高级过滤（自定义选项）
const advancedFiltered = filterParams(params, {
  keepZero: true,
  keepEmptyArray: false,
  keepEmptyObject: false,
});
```

## API 参考

### createDefaultApi(callbacks?, filterOptions?)

创建使用默认配置的API实例。

### createApiInstance(config, callbacks?, filterOptions?)

创建自定义配置的API实例。

### 工具函数

- `getAuthToken()`: 获取当前token
- `getRefreshToken()`: 获取刷新token
- `setAuthTokens(accessToken, refreshToken)`: 设置token
- `clearAuthTokens()`: 清除token
- `filterParams(params, options?)`: 高级参数过滤
- `filterEmptyParams(params)`: 基础参数过滤

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式（监听文件变化）
npm run dev
```

## 文件结构

```
apps/shared-utils/
├── src/
│   ├── constants.ts    # 共享常量
│   ├── types.ts        # 类型定义
│   ├── request.ts      # 请求工具（包含参数过滤）
│   └── index.ts        # 主入口
├── dist/               # 构建输出
├── package.json
└── tsconfig.json
```

## 依赖

- `axios`: HTTP客户端
- `omit-empty`: 参数过滤工具
