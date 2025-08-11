import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { getSubAppConfigByBaseroute } from "../config/subApps";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/:appType",
    name: "SubApp",
    component: () => import("../views/SubApp.vue"),
    props: (route) => {
      const appType = route.params.appType as string;
      const subAppConfig = getSubAppConfigByBaseroute(`/${appType}`);

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置主应用的路由对象
microApp.router.setBaseAppRouter(router);
export default router;
