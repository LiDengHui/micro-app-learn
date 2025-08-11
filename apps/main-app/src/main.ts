import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import "./style.scss";
import microApp from "@micro-zoe/micro-app";

// Initialize micro-app
microApp.start({});

// Expose shared libraries to sub-apps
(window as any).Vue = { createApp };
(window as any).VueRouter = router;
(window as any).ElementPlus = ElementPlus;

// Handle micro-app lifecycle
microApp.addDataListener("main-app", (data: any) => {
  console.log("Received data from micro-app:", data);
});

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
