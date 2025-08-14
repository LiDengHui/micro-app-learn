import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { microConfigPlugin } from "@micro-frontend/shared-utils/vite-plugin-micro-config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    microConfigPlugin({
      root: process.cwd(),
      outputFileName: "micro.config.json",
    }),
  ],
  base: "/",
  server: {
    port: 7102,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      external: ["vue", "vue-router", "element-plus"],
      output: {
        format: "umd",
        name: "subAppVue",
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          "element-plus": "ElementPlus",
        },
        entryFileNames: "index.js",
      },
    },
  },
  define: {
    global: "window",
  },
});
