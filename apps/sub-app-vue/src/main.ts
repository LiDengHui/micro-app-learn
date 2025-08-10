import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

function render() {
  const mountElement = document.querySelector("#app");
  if (mountElement) {
    const app = createApp(App).mount(mountElement);

    console.log(app);
  }
}

// Handle micro-app lifecycle

window.addEventListener("unmount", () => {
  console.log("Vue app unmounted");
  // Cleanup if needed
});
// Running standalone
render();
