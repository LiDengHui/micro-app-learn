import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { getSubAppConfigByBaseroute } from "../config/subApps";
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/sub-app/:appType",
    name: "SubApp",
    component: () => import("../views/SubApp.vue"),
    meta: { requiresAuth: true },
    props: (route) => {
      const appType = route.params.appType as string;
      const subAppConfig = getSubAppConfigByBaseroute(`/sub-app/${appType}`);

      if (!subAppConfig) {
        // 如果找不到对应的子应用配置，返回默认值或重定向到首页
        return {
          appName: "",
          appUrl: "",
          baseroute: "",
        };
      }

      return {
        appName: subAppConfig.name,
        appUrl: subAppConfig.url,
        baseroute: subAppConfig.baseroute,
      };
    },
  },
  {
    path: "/sub-app/:appType/:pathMatch(.*)*",
    name: "SubAppRoute",
    component: () => import("../views/SubApp.vue"),
    meta: { requiresAuth: true },
    props: (route) => {
      const appType = route.params.appType as string;
      const subAppConfig = getSubAppConfigByBaseroute(`/sub-app/${appType}`);

      if (!subAppConfig) {
        return {
          appName: "",
          appUrl: "",
          baseroute: "",
        };
      }

      return {
        appName: subAppConfig.name,
        appUrl: subAppConfig.url,
        baseroute: subAppConfig.baseroute,
      };
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 动态导入 authStore 避免循环依赖
  const { useAuthStore } = await import("../stores/auth");
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但未登录，跳转到登录页
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && authStore.isAuthenticated) {
    // 已登录用户访问登录页，跳转到首页
    next({ name: "Home" });
  } else {
    next();
  }
});

// 设置主应用的路由对象
microApp.router.setBaseAppRouter(router);
export default router;
