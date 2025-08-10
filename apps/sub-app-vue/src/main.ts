import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

function render(container?: Element) {
  const mountElement = container
    ? container.querySelector("#app")
    : document.querySelector("#app");
  if (mountElement) {
    const app = createApp(App);

    // Use shared libraries from main app if available
    if (window.VueRouter) {
      app.use(window.VueRouter);
    }
    if (window.ElementPlus) {
      app.use(window.ElementPlus);
    }

    app.mount(mountElement);
  }
}

// Handle micro-app lifecycle
if (window.__MICRO_APP_ENVIRONMENT__) {
  // Running in micro-app
  window.addEventListener("mount", () => {
    console.log("Vue app mounted");
    render();
  });

  window.addEventListener("unmount", () => {
    console.log("Vue app unmounted");
    // Cleanup if needed
  });
} else {
  // Running standalone
  render();
}
