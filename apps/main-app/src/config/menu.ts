import { subApps } from "./subApps";

export interface MenuItem {
  title: string;
  name?: string;
  path?: string;
  moduleUrl?: string;
  children?: MenuItem[];
}

export interface MenuGroup {
  title: string;
  children: MenuItem[];
}

export function buildMenuData(): MenuGroup[] {
  return [
    {
      title: subApps["react-app"].title,
      children: [
        {
          title: "订单管理",
          name: subApps["react-app"].name,
          path: "/",
          children: [
            {
              title: "订单列表",
              name: subApps["react-app"].name,
              path: "/orders",
            },
            {
              title: "用户管理",
              name: subApps["react-app"].name,
              path: "/users",
            },
          ],
        },
        {
          title: "产品管理",
          name: subApps["react-app"].name,
          path: "/products",
        },
      ],
    },
    {
      title: subApps["vue-app"].title,
      children: [
        {
          title: "订单管理",
          name: subApps["vue-app"].name,
          path: "/",
          children: [
            {
              title: "订单列表",
              name: subApps["vue-app"].name,
              path: "/orders",
            },
            {
              title: "用户管理",
              name: subApps["vue-app"].name,
              path: "/users",
            },
          ],
        },
        {
          title: "用户管理系统",
          name: subApps["vue-app"].name,
          path: "/user-management",
        },
        {
          title: "角色管理系统",
          name: subApps["vue-app"].name,
          path: "/role-management",
        },
        {
          title: "部门管理系统",
          name: subApps["vue-app"].name,
          path: "/department-management",
        },
        {
          title: "子应用管理",
          name: subApps["vue-app"].name,
          path: "/sub-app-management",
        },
        { title: "产品管理", name: subApps["vue-app"].name, path: "/products" },
      ],
    },
    {
      title: "系统设置",
      children: [
        {
          title: "基础设置",
          moduleUrl: "https://example.com/settings",
          children: [
            {
              title: "系统配置",
              moduleUrl: "https://example.com/settings/config",
            },
            {
              title: "用户权限",
              moduleUrl: "https://example.com/settings/permissions",
            },
          ],
        },
        { title: "安全中心", moduleUrl: "https://example.com/security" },
      ],
    },
  ];
}
