import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { notifyMainAppRouteChange } from "./notifyMainApp";

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
export default router;
