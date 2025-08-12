export interface SubAppConfig {
  name: string;
  url: string;
  baseroute: string;
  title: string;
}

export const subApps: Record<string, SubAppConfig> = {
  "react-app": {
    name: "react-app",
    url: "http://localhost:7101",
    baseroute: "/sub-app/react-app",
    title: "React子应用",
  },
  "vue-app": {
    name: "vue-app",
    url: "http://localhost:7102",
    baseroute: "/sub-app/vue-app",
    title: "Vue子应用",
  },
};

export const getSubAppConfig = (appName: string): SubAppConfig | undefined => {
  return subApps[appName];
};

export const getSubAppConfigByBaseroute = (
  baseroute: string
): SubAppConfig | undefined => {
  console.log(baseroute);
  return Object.values(subApps).find((app) => app.baseroute === baseroute);
};
