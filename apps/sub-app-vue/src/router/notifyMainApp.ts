declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    microApp?: {
      dispatch: (data: any) => void;
    };
  }
}

const routeMenuMap: Record<string, { title: string; path: string }> = {
  "/": { title: "订单管理", path: "/" },
  "/orders": { title: "订单列表", path: "/orders" },
  "/users": { title: "用户管理", path: "/users" },
  "/products": { title: "产品管理", path: "/products" },
};

export function notifyMainAppRouteChange(path: string) {
  try {
    if (!window.__MICRO_APP_ENVIRONMENT__) return;
    const menuInfo = routeMenuMap[path] ?? routeMenuMap["/"];
    window.microApp?.dispatch({
      name: "route-change",
      data: {
        appName: "vue-app",
        path,
        menuTitle: menuInfo.title,
        menuPath: menuInfo.path,
      },
    });
  } catch (error) {
    console.error("通知主应用路由变化失败:", error);
  }
}


