import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useNavigationStore = defineStore("navigation", () => {
  // ==================== 状态定义 ====================
  const defaultPage = ref<string | null>(null);
  const targetPath = ref<string | null>(null);
  const currentApp = ref<string | null>(null);
  const readyAppName = ref<string | null>(null);
  const appName = ref<string | null>(null);
  const appUrl = ref<string | null>(null);

  // ==================== 计算属性 ====================
  const hasDefaultPage = computed(() => Boolean(defaultPage.value));
  const hasTargetPath = computed(() => Boolean(targetPath.value));
  const isAppSelected = computed(() => Boolean(currentApp.value));

  // ==================== 核心方法 ====================

  /**
   * 设置默认页面
   */
  const setDefaultPage = (page: string) => {
    defaultPage.value = page;
  };

  /**
   * 获取默认页面（优先从 store 获取）
   */
  const getDefaultPage = (): string | null => {
    return defaultPage.value;
  };

  /**
   * 设置目标路径
   */
  const setTargetPath = (path: string) => {
    targetPath.value = path;
  };

  /**
   * 获取目标路径（优先从 store 获取）
   */
  const getTargetPath = (): string | null => {
    return targetPath.value;
  };

  /**
   * 设置当前应用
   */
  const setCurrentApp = (appName: string) => {
    currentApp.value = appName;
  };

  /**
   * 设置应用名称
   */
  const setAppName = (name: string) => {
    appName.value = name;
  };

  /**
   * 获取应用名称
   */
  const getAppName = (): string | null => {
    return appName.value;
  };

  /**
   * 设置应用URL
   */
  const setAppUrl = (url: string) => {
    appUrl.value = url;
  };

  /**
   * 获取应用URL
   */
  const getAppUrl = (): string | null => {
    return appUrl.value;
  };

  /**
   * 设置应用准备状态
   */
  const setAppReady = (appName: string, ready: boolean) => {
    if (ready) {
      // 设置为 ready 状态，同时清除其他应用的 ready 状态
      readyAppName.value = appName;
    } else {
      // 清除 ready 状态
      if (readyAppName.value === appName) {
        readyAppName.value = null;
      }
    }
  };

  /**
   * 获取应用准备状态
   */
  const getAppReady = (appName: string): boolean => {
    return readyAppName.value === appName;
  };

  // ==================== 清理方法 ====================

  /**
   * 清除默认页面
   */
  const clearDefaultPage = () => {
    defaultPage.value = null;
  };

  /**
   * 清除目标路径
   */
  const clearTargetPath = () => {
    targetPath.value = null;
  };

  /**
   * 清除所有导航状态
   */
  const clearAllNavigation = () => {
    clearDefaultPage();
    clearTargetPath();
    currentApp.value = null;
    readyAppName.value = null;
    appName.value = null;
    appUrl.value = null;
  };

  // ==================== 初始化方法 ====================

  /**
   * 从 sessionStorage 恢复状态
   */

  // ==================== 导出 ====================
  return {
    // 状态
    defaultPage,
    targetPath,
    currentApp,
    readyAppName,
    appName,
    appUrl,

    // 计算属性
    hasDefaultPage,
    hasTargetPath,
    isAppSelected,

    // 核心方法
    setDefaultPage,
    getDefaultPage,
    setTargetPath,
    getTargetPath,
    setCurrentApp,
    setAppReady,
    getAppReady,
    setAppName,
    getAppName,
    setAppUrl,
    getAppUrl,

    // 清理方法
    clearDefaultPage,
    clearTargetPath,
    clearAllNavigation,
  };
});
