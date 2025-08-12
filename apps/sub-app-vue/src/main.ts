import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

function render(container?: Element) {
  const mountElement = container
    ? container.querySelector("#app")
    : document.querySelector("#app");
  if (mountElement) {
    // Use shared Vue from main app if available, otherwise use local
    const app = createApp(App);

    // Use shared libraries from main app if available
    app.use(ElementPlus);

    // 注册所有图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }

    // Use local router for sub-app
    app.use(router);

    app.mount(mountElement);
  }
}

// Handle micro-app lifecycle

function handleAppStateChange(e: Event) {
  const detail = (e as CustomEvent<{ appState: string }>).detail;
  if (detail?.appState === "afterhidden") {
    console.log("已卸载");
  } else if (detail?.appState === "beforeshow") {
    console.log("即将重新渲染");
  } else if (detail?.appState === "aftershow") {
    console.log("已经重新渲染");
  }
}

function handleUnmount() {
  console.log("Vue app unmounted");
  window.removeEventListener("appstate-change", handleAppStateChange);
  window.removeEventListener("unmount", handleUnmount);
}

window.addEventListener("unmount", handleUnmount);

// 监听keep-alive模式下的应用状态
window.addEventListener("appstate-change", handleAppStateChange);
// Running standalone
render();
