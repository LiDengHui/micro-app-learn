import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// 扩展Window接口以支持microApp
declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    microApp?: {
      dispatch: (data: any) => void;
      addDataListener: (listener: (data: any) => void) => void;
    };
  }
}

// 路由映射表 - 用于通知主应用当前菜单项
const routeMenuMap: Record<string, { title: string; path: string }> = {
  "/": { title: "订单管理", path: "/" },
  "/orders": { title: "订单列表", path: "/orders" },
  "/users": { title: "用户管理", path: "/users" },
  "/products": { title: "产品管理", path: "/products" },
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/Orders.vue"),
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫 - 路由变化时通知主应用
router.beforeEach((to, from, next) => {
  console.log("Vue子应用路由变化:", { from: from.path, to: to.path });

  // 通知主应用当前路由变化
  notifyMainAppRouteChange(to.path);

  next();
});

/**
 * 通知主应用路由变化
 */
function notifyMainAppRouteChange(path: string) {
  try {
    // 检查是否在微前端环境中
    if (window.__MICRO_APP_ENVIRONMENT__) {
      const menuInfo = routeMenuMap[path];

      if (menuInfo) {
        // 使用 microApp.dispatch 发送路由变化数据
        window.microApp?.dispatch({
          name: "route-change",
          data: {
            appName: "vue-app",
            path: path,
            menuTitle: menuInfo.title,
            menuPath: menuInfo.path,
          },
        });

        console.log("已通知主应用路由变化:", menuInfo);
      } else {
        // 如果没有对应的菜单项，发送默认的首页菜单信息
        const defaultMenuInfo = routeMenuMap["/"];
        window.microApp?.dispatch({
          name: "route-change",
          data: {
            appName: "vue-app",
            path: path,
            menuTitle: defaultMenuInfo.title,
            menuPath: defaultMenuInfo.path,
          },
        });

        console.log("路由无对应菜单，使用默认菜单:", defaultMenuInfo);
      }
    }
  } catch (error) {
    console.error("通知主应用路由变化失败:", error);
  }
}

export default router;
