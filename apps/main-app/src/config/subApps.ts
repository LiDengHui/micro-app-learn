export interface SubAppConfig {
  name: string;
  url: string;
  baseroute: string;
  title: string;
  defaultPage?: string;
}

export const subApps: Record<string, SubAppConfig> = {
  "react-app": {
    name: "react-app",
    url: "http://localhost:7101",
    baseroute: "/react",
    title: "React子应用",
    defaultPage: "/",
  },
  "vue-app": {
    name: "vue-app",
    url: "http://localhost:7102",
    baseroute: "/vue",
    title: "Vue子应用",
    defaultPage: "/",
  },
};

export const getSubAppConfig = (appName: string): SubAppConfig | undefined => {
  return subApps[appName];
};

export const getSubAppConfigByBaseroute = (
  baseroute: string
): SubAppConfig | undefined => {
  return Object.values(subApps).find((app) => app.baseroute === baseroute);
};
