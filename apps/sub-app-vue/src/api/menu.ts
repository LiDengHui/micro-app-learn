import { createApiClient } from "@micro-frontend/shared-utils";

// 创建 API 客户端
const api = createApiClient();

// nest-serve 的响应格式
export interface NestApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 菜单元数据类型定义
export interface MenuMeta {
  id?: number;
  icon?: string;
  title?: string;
  affix?: boolean;
  alwaysShow?: boolean;
  breadcrumb?: boolean;
  canTo?: boolean;
  hidden?: boolean;
  noCache?: boolean;
  noTagsView?: boolean;
}

// 权限类型定义
export interface Permission {
  id?: number;
  label: string;
  value: string;
}

// 菜单类型定义 - 根据 nest-serve 的 Menu 实体
export interface Menu {
  id: number;
  name: string;
  title: string;
  path: string;
  component: string;
  redirect?: string;
  type: number;
  parentId?: number | null;
  status: boolean;
  meta?: MenuMeta;
  permissions?: Permission[];
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuDto {
  name: string;
  title: string;
  path: string;
  component: string;
  redirect?: string;
  type: number;
  parentId?: number | null;
  status: boolean;
  meta: MenuMeta;
  permissions: Permission[];
}

export interface UpdateMenuDto extends CreateMenuDto {
  id: number;
}

export interface MenuListQuery {
  page?: number;
  limit?: number;
  name?: string;
  status?: number | null;
}

export interface MenuListData {
  list: Menu[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MenuListResponse extends NestApiResponse<MenuListData> {}

// 菜单 API - 根据 nest-serve 的实际接口路径
export const menuApi = {
  // 获取菜单列表
  getMenus: (query: MenuListQuery = {}): Promise<MenuListResponse> => {
    return api.get("/menu", { params: query });
  },

  // 获取菜单详情
  getMenu: (id: number): Promise<NestApiResponse<Menu>> => {
    return api.get(`/menu/${id}`);
  },

  // 创建菜单
  createMenu: (data: CreateMenuDto): Promise<NestApiResponse<Menu>> => {
    return api.post("/menu", data);
  },

  // 更新菜单
  updateMenu: (data: UpdateMenuDto): Promise<NestApiResponse<Menu>> => {
    return api.post("/menu", data);
  },

  // 删除菜单
  deleteMenu: (id: number): Promise<NestApiResponse<void>> => {
    return api.post("/menu/delete", { ids: [id] });
  },
};

export default api;
