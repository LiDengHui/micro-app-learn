import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { subApps } from "../config/subApps";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/react",
    name: "ReactApp",
    component: () => import("../views/SubApp.vue"),
    props: () => {
      return {
        appName: subApps["react-app"].name,
        appUrl: subApps["react-app"].url,
        baseroute: subApps["react-app"].baseroute,
      };
    },
  },
  {
    path: "/vue",
    name: "VueApp",
    component: () => import("../views/SubApp.vue"),
    props: () => {
      return {
        appName: subApps["vue-app"].name,
        appUrl: subApps["vue-app"].url,
        baseroute: subApps["vue-app"].baseroute,
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
