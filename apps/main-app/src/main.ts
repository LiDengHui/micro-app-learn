import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import "./style.scss";
import microApp from "@micro-zoe/micro-app";
import eventBus from "./utils/eventBus";
import api from "./utils/request";

// Initialize micro-app
microApp.start({});

// Enable EventBus verbose logs in development
if (import.meta.env.DEV) {
  eventBus.setLoggingEnabled(true);
}

// Expose shared libraries to sub-apps
(window as any).Vue = { createApp };
(window as any).VueRouter = router;
(window as any).ElementPlus = ElementPlus;
(window as any).MainAppAxios = api;

// Handle micro-app lifecycle
microApp.addDataListener("main-app", (data: any) => {
  console.log("Received data from micro-app:", data);
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
