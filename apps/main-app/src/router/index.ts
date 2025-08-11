import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { subApps } from "../config/subApps";
import { useNavigationStore } from "../stores/navigation";
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
      const navigationStore = useNavigationStore();
      return {
        appName: subApps["react-app"].name,
        appUrl: subApps["react-app"].url,
        baseroute: subApps["react-app"].baseroute,
        defaultPage:
          navigationStore.getDefaultPage() || subApps["react-app"].defaultPage,
      };
    },
  },
  {
    path: "/react/:page*",
    name: "ReactApp",
    component: () => import("../views/SubApp.vue"),
    props: () => {
      const navigationStore = useNavigationStore();
      return {
        appName: subApps["react-app"].name,
        appUrl: subApps["react-app"].url,
        baseroute: subApps["react-app"].baseroute,
        defaultPage:
          navigationStore.getDefaultPage() || subApps["react-app"].defaultPage,
      };
    },
  },
  {
    path: "/vue",
    name: "VueApp",
    component: () => import("../views/SubApp.vue"),
    props: () => {
      const navigationStore = useNavigationStore();
      return {
        appName: subApps["vue-app"].name,
        appUrl: subApps["vue-app"].url,
        baseroute: subApps["vue-app"].baseroute,
        defaultPage:
          navigationStore.getDefaultPage() || subApps["vue-app"].defaultPage,
      };
    },
  },
  {
    path: "/vue/:page*",
    name: "VueApp",
    component: () => import("../views/SubApp.vue"),
    props: () => ({
      appName: subApps["vue-app"].name,
      appUrl: subApps["vue-app"].url,
      baseroute: subApps["vue-app"].baseroute,
      defaultPage:
        sessionStorage.getItem("defaultPage") || subApps["vue-app"].defaultPage,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置主应用的路由对象
microApp.router.setBaseAppRouter(router);
export default router;
