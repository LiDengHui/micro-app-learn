declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    __MICRO_APP_NAME__?: string;
    __MICRO_APP_BASE_ROUTE__?: string;
    mounted?: (props: any) => void;
  }
}

export {};