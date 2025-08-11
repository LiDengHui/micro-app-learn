import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 7101,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        format: "umd",
        name: "subAppReact",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
        },
        entryFileNames: "index.js",
      },
    },
  },
  define: {
    global: "window",
  },
});
