import "./public-path";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";

// Make React and ReactDOM available globally for micro-app
if (typeof window !== "undefined") {
  (window as any).React = React;
  (window as any).ReactDOM = { createRoot };
}

function render(props: any = {}) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector("#root")
    : document.querySelector("#root");
  console.log(rootElement);
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );
  }
}

// Handle micro-app lifecycle
console.log(window.__MICRO_APP_ENVIRONMENT__);

function handleAppStateChange(e) {
  if (e.detail.appState === "afterhidden") {
    console.log("已卸载");
  } else if (e.detail.appState === "beforeshow") {
    console.log("即将重新渲染");
  } else if (e.detail.appState === "aftershow") {
    console.log("已经重新渲染");
  }
}

function handleUnmount() {
  console.log("React app unmounted");
  window.removeEventListener("appstate-change", handleAppStateChange);
  window.removeEventListener("unmount", handleUnmount);
}

window.addEventListener("unmount", handleUnmount);

// 监听keep-alive模式下的应用状态
window.addEventListener("appstate-change", handleAppStateChange);
// Running standalone
render();
