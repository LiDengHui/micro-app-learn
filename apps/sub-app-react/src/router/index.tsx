import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../views/Home";
import Orders from "../views/Orders";
import Users from "../views/Users";
import { notifyMainAppRouteChange } from "./notifyMainApp";

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

// 由 notifyMainApp.ts 提供通知函数

// 初始化路由监听器
if (window.__MICRO_APP_ENVIRONMENT__) {
  createRouteListener();
  // 初始化时通知当前路径
  notifyMainAppRouteChange(currentPath);
}

export default router;
