import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import microApp from "@micro-zoe/micro-app";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/react",
    name: "ReactApp",
    component: () => import("../views/ReactApp.vue"),
  },
  {
    path: "/react/:page*",
    name: "ReactApp",
    component: () => import("../views/ReactApp.vue"),
  },
  {
    path: "/vue/:page*",
    name: "VueApp",
    component: () => import("../views/VueApp.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置主应用的路由对象
microApp.router.setBaseAppRouter(router);
export default router;
