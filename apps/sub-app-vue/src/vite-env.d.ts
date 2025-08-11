/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    __MICRO_APP_NAME__?: string;
    __MICRO_APP_BASE_ROUTE__?: string;
    Vue?: any;
    VueRouter?: any;
    ElementPlus?: any;
  }
}

declare module globalThis {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    __MICRO_APP_NAME__?: string;
    __MICRO_APP_BASE_ROUTE__?: string;
  }
}
