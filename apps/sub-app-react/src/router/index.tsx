import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../views/Home";
import Orders from "../views/Orders";
import Users from "../views/Users";

// 路由映射表 - 用于通知主应用当前菜单项
const routeMenuMap: Record<string, { title: string; path: string }> = {
  "/": { title: "订单管理", path: "/" },
  "/orders": { title: "订单列表", path: "/orders" },
  "/users": { title: "用户管理", path: "/users" },
  "/products": { title: "产品管理", path: "/products" },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);

// 扩展Window接口以支持microApp
declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    microApp?: {
      dispatch: (data: any) => void;
    };
  }
}

// 监听路由变化并通知主应用
let currentPath = window.location.pathname;

// 创建路由监听器
const createRouteListener = () => {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    const newPath = args[2] as string;
    if (newPath && newPath !== currentPath) {
      currentPath = newPath;
      notifyMainAppRouteChange(newPath);
    }
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    const newPath = args[2] as string;
    if (newPath && newPath !== currentPath) {
      currentPath = newPath;
      notifyMainAppRouteChange(newPath);
    }
  };

  // 监听popstate事件
  window.addEventListener("popstate", () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      currentPath = newPath;
      notifyMainAppRouteChange(newPath);
    }
  });
};

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
            appName: "react-app",
            path: path,
            menuTitle: menuInfo.title,
            menuPath: menuInfo.path,
          },
        });

        console.log("React子应用已通知主应用路由变化:", menuInfo);
      } else {
        // 如果没有对应的菜单项，发送默认的首页菜单信息
        const defaultMenuInfo = routeMenuMap["/"];
        window.microApp?.dispatch({
          name: "route-change",
          data: {
            appName: "react-app",
            path: path,
            menuTitle: defaultMenuInfo.title,
            menuPath: defaultMenuInfo.path,
          },
        });

        console.log(
          "React子应用路由无对应菜单，使用默认菜单:",
          defaultMenuInfo
        );
      }
    }
  } catch (error) {
    console.error("React子应用通知主应用路由变化失败:", error);
  }
}

// 初始化路由监听器
if (window.__MICRO_APP_ENVIRONMENT__) {
  createRouteListener();
  // 初始化时通知当前路径
  notifyMainAppRouteChange(currentPath);
}

export default router;
