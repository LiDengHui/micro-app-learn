import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

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
    path: "/vue",
    name: "VueApp",
    component: () => import("../views/VueApp.vue"),
  },
  {
    path: "/vue/orders",
    name: "VueOrders",
    component: () => import("../views/VueOrders.vue"),
  },
  {
    path: "/vue/users",
    name: "VueUsers",
    component: () => import("../views/VueUsers.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
