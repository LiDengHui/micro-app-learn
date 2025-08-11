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

window.addEventListener("unmount", () => {
  console.log("React app unmounted");
  // Cleanup if needed
});

// Running standalone
render();
