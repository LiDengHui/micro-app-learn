# 微前端管理系统

## 项目概述

本项目是一个基于微前端架构的管理系统，整合了 Nest.js 后端服务、Vue 3 主应用和多个子应用，实现了统一的用户认证和子应用间的通信。

## 技术栈

### 后端服务 (nest-serve)
- **框架**: Nest.js
- **数据库**: MySQL + TypeORM
- **认证**: JWT + Passport
- **缓存**: Redis
- **API**: RESTful API + Swagger 文档

### 主应用 (main-app)
- **框架**: Vue 3 + TypeScript
- **UI库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **微前端**: micro-app
- **构建工具**: Vite

### React 子应用 (sub-app-react)
- **框架**: React 18 + TypeScript
- **路由**: React Router
- **样式**: CSS Modules
- **构建工具**: Vite

### Vue 子应用 (sub-app-vue)
- **框架**: Vue 3 + TypeScript
- **UI库**: Element Plus
- **路由**: Vue Router
- **构建工具**: Vite

## 功能特性

### 1. 统一认证系统
- ✅ 登录/登出功能
- ✅ JWT Token 管理
- ✅ 自动刷新 Token
- ✅ 路由守卫
- ✅ 用户状态全局管理

### 2. 微前端架构
- ✅ 主应用统一导航
- ✅ 子应用独立开发部署
- ✅ 应用间通信
- ✅ 菜单状态同步

### 3. CRUD 系统 (sub-app-vue)
- ✅ 用户管理
- ✅ 分页查询
- ✅ 搜索过滤
- ✅ 增删改查操作
- ✅ 状态管理

### 4. 代码质量
- ✅ TypeScript 类型安全
- ✅ Clean Code 重构
- ✅ 组件化设计
- ✅ 错误处理

## 项目结构

```
micro-frontend-project/
├── apps/
│   ├── main-app/           # Vue 3 主应用
│   │   ├── src/
│   │   │   ├── api/        # API 服务
│   │   │   ├── stores/     # Pinia 状态管理
│   │   │   ├── views/      # 页面组件
│   │   │   ├── config/     # 配置文件
│   │   │   └── types/      # 类型定义
│   │   └── package.json
│   ├── sub-app-react/      # React 子应用
│   │   ├── src/
│   │   │   ├── views/      # 页面组件
│   │   │   ├── router/     # 路由配置
│   │   │   └── types.d.ts  # 类型声明
│   │   └── package.json
│   └── sub-app-vue/        # Vue 子应用
│       ├── src/
│       │   ├── api/        # API 服务
│       │   ├── views/      # 页面组件
│       │   └── router/     # 路由配置
│       └── package.json
├── start-all.sh           # 启动脚本
└── package.json           # 工作区配置

nest-serve/                 # Nest.js 后端
├── src/
│   ├── system/            # 系统模块
│   │   ├── auth/          # 认证模块
│   │   ├── user/          # 用户模块
│   │   └── ...
│   └── app.module.ts
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd micro-frontend-project
npm install

# 安装后端依赖
cd ../nest-serve
npm install
```

### 2. 配置数据库

1. 创建 MySQL 数据库
2. 配置 `nest-serve/.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT 配置
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. 启动服务

#### 方式一：使用启动脚本（推荐）
```bash
cd micro-frontend-project
./start-all.sh
```

#### 方式二：手动启动
```bash
# 1. 启动后端服务
cd nest-serve
npm run dev

# 2. 启动前端服务
cd ../micro-frontend-project
npm run dev:all
```

### 4. 访问应用

- **主应用**: http://localhost:8080
- **React 子应用**: http://localhost:7101
- **Vue 子应用**: http://localhost:7102
- **后端 API**: http://localhost:9000

### 5. 登录测试

演示账号：
- 用户名: `admin` / 密码: `admin`
- 用户名: `test` / 密码: `test`

## 开发指南

### 添加新的子应用

1. 在 `apps/` 目录下创建新的应用
2. 在 `config/subApps.ts` 中配置应用信息
3. 在 `config/menu.ts` 中添加菜单项
4. 实现应用间通信

### 添加新的 API

1. 在 `nest-serve/src/` 中创建新的模块
2. 在子应用的 `api/` 目录中添加 API 服务
3. 更新类型定义

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Clean Code 原则
- 组件化开发
- 统一的错误处理

## API 接口

### 认证相关
- `POST /auth/login` - 用户登录
- `POST /auth/profile` - 获取用户信息
- `POST /auth/refresh-token` - 刷新 Token
- `GET /auth/loginOut` - 用户登出

### 用户管理
- `GET /system/user` - 获取用户列表
- `GET /system/user/:id` - 获取用户详情
- `POST /system/user` - 创建用户
- `PATCH /system/user/:id` - 更新用户
- `DELETE /system/user/:id` - 删除用户

## 部署说明

### 开发环境
按照上述快速开始步骤即可启动开发环境。

### 生产环境
1. 构建前端应用: `npm run build:all`
2. 构建后端应用: `npm run build`
3. 配置 Nginx 反向代理
4. 配置生产数据库

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License
