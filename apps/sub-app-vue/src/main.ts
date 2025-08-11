import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

function render(container?: Element) {
  const mountElement = container
    ? container.querySelector("#app")
    : document.querySelector("#app");
  if (mountElement) {
    // Use shared Vue from main app if available, otherwise use local
    const app = createApp(App);

    // Use shared libraries from main app if available
    app.use(ElementPlus);

    // Use local router for sub-app
    app.use(router);

    app.mount(mountElement);
  }
}

// Handle micro-app lifecycle
window.addEventListener("unmount", () => {
  console.log("Vue app unmounted");
  // Cleanup if needed
});
// Running standalone
render();
