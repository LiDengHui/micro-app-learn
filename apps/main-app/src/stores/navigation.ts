import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationStore = defineStore("navigation", () => {
  // 状态
  const defaultPage = ref<string | null>(null);
  const targetPath = ref<string | null>(null);
  const currentApp = ref<string | null>(null);

  // 设置默认页面
  const setDefaultPage = (page: string) => {
    defaultPage.value = page;
    // 同时更新 sessionStorage 以保持兼容性
    sessionStorage.setItem("defaultPage", page);
  };

  // 获取默认页面
  const getDefaultPage = (): string | null => {
    // 优先从 store 获取，如果没有则从 sessionStorage 获取
    return defaultPage.value || sessionStorage.getItem("defaultPage");
  };

  // 设置目标路径
  const setTargetPath = (path: string) => {
    targetPath.value = path;
    sessionStorage.setItem("targetPath", path);
  };

  // 获取目标路径
  const getTargetPath = (): string | null => {
    return targetPath.value || sessionStorage.getItem("targetPath");
  };

  // 设置当前应用
  const setCurrentApp = (appName: string) => {
    currentApp.value = appName;
  };

  // 清除默认页面
  const clearDefaultPage = () => {
    defaultPage.value = null;
    sessionStorage.removeItem("defaultPage");
  };

  // 清除目标路径
  const clearTargetPath = () => {
    targetPath.value = null;
    sessionStorage.removeItem("targetPath");
  };

  // 清除所有导航状态
  const clearAllNavigation = () => {
    clearDefaultPage();
    clearTargetPath();
    currentApp.value = null;
  };

  // 初始化状态（从 sessionStorage 恢复）
  const initializeFromStorage = () => {
    const storedDefaultPage = sessionStorage.getItem("defaultPage");
    const storedTargetPath = sessionStorage.getItem("targetPath");

    if (storedDefaultPage) {
      defaultPage.value = storedDefaultPage;
    }
    if (storedTargetPath) {
      targetPath.value = storedTargetPath;
    }
  };

  return {
    // 状态
    defaultPage,
    targetPath,
    currentApp,

    // 方法
    setDefaultPage,
    getDefaultPage,
    setTargetPath,
    getTargetPath,
    setCurrentApp,
    clearDefaultPage,
    clearTargetPath,
    clearAllNavigation,
    initializeFromStorage,
  };
});
