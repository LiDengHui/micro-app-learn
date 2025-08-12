<template>
  <div id="micro-content">
    <micro-app
      :name="appName"
      :url="appUrl"
      :baseroute="baseroute"
      :default-page="navigationStore.targetPath"
      iframe
      ssr
      keep-alive
      @created="handleCreated"
      @beforemount="handleBeforemount"
      @mounted="handleMounted"
      @beforeshow="handleBeforeshow"
      @aftershow="handleAftershow"
      @hide="handleHide"
      @error="handleError"
      @unmount="handleUnmount"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { useNavigationStore } from "../stores/navigation";
import eventBus from "../utils/eventBus";
import { MENU_UPDATE } from "../constants/events";

// ==================== 类型定义 ====================
interface Props {
  appName: string;
  appUrl: string;
  baseroute: string;
}

type MicroAppEvent = CustomEvent<{ name: string }>;

// 路由变化事件类型
interface RouteChangeEvent {
  name: string;
  data: {
    appName: string;
    path: string;
    menuTitle: string;
    menuPath: string;
  };
}

// 菜单更新事件类型
interface MenuUpdateEvent {
  appName: string;
  path: string;
  menuTitle: string;
  menuPath: string;
}

// ==================== 组合式函数 ====================
const props = defineProps<Props>();
const router = useRouter();
const navigationStore = useNavigationStore();

// ==================== 方法定义 ====================

/**
 * 处理子应用创建
 */
const handleCreated = () => {
  console.log("handleCreated");
};

/**
 * 处理子应用即将挂载
 */
const handleBeforemount = () => {
  console.log("handleBeforemount");

  // 设置数据监听器，监听多种事件类型
  microApp.addDataListener(props.appName, (data: any) => {
    if (data.name === "route-change") {
      handleRouteChange(data);
    } else if (data.name === "navigate-to-main") {
      handleNavigateToMain(data);
    }
  });
  console.log(`已设置子应用 ${props.appName} 数据监听器`);
};

/**
 * 处理子应用挂载完成
 */
const handleMounted = (e: MicroAppEvent) => {
  console.log("handleMounted");
  navigationStore.setAppReady(e.detail.name, true);
};

/**
 * 处理子应用推入后台
 */
const handleHide = () => {
  console.log("handleHide");
};

/**
 * 处理子应用即将推入前台
 */
const handleBeforeshow = (e: MicroAppEvent) => {
  // 如果当前已经缓存路由信息，则需要重新push一次
  console.log("handleBeforeshow", e.detail.name);
};

/**
 * 处理子应用已推入前台
 */
const handleAftershow = (e: MicroAppEvent) => {
  console.log("handleAftershow", e);
  if (e.detail.name === props.appName) {
    // 如果当前路由信息与目标路由信息不一致，则需要重新push一次
    const routeInfo = microApp.router.current.get(props.appName);
    if (routeInfo?.pathname !== navigationStore.targetPath) {
      microApp.router.push({
        name: props.appName,
        path: navigationStore.targetPath!,
      });
    }
  }
  navigationStore.setAppReady(e.detail.name, true);
};

/**
 * 处理子应用渲染错误
 */
const handleError = (error: MicroAppEvent) => {
  console.log("handleError", error);
  // 发生错误时重置准备状态
  navigationStore.setAppReady(props.appName, false);
};

/**
 * 处理子应用卸载
 */
const handleUnmount = (e: MicroAppEvent) => {
  console.log("handleUnmount", e);
  navigationStore.setAppReady(e.detail.name, false);

  // 移除监听器
  try {
    microApp.removeDataListener(props.appName, handleRouteChange);
    console.log(`已移除子应用 ${props.appName} 数据监听器`);
  } catch (error) {
    console.log(`移除子应用 ${props.appName} 数据监听器失败:`, error);
  }
};

/**
 * 处理子应用路由变化
 */
const handleRouteChange = (data: RouteChangeEvent) => {
  console.log("SubApp收到子应用路由变化数据:", data);

  const { appName, path, menuTitle, menuPath } = data.data;

  if (appName === props.appName) {
    // 更新导航状态
    navigationStore.setTargetPath(path);

    // 通过eventBus上报menu-update事件
    const menuUpdateData: MenuUpdateEvent = {
      appName,
      path,
      menuTitle,
      menuPath,
    };

    eventBus.emit(MENU_UPDATE, menuUpdateData);
    console.log("已通过eventBus上报menu-update事件:", menuUpdateData);
  }
};

/**
 * 处理导航到主应用事件
 */
const handleNavigateToMain = (data: any) => {
  console.log("子应用请求导航到主应用:", data);

  // 跳转到主应用首页
  router.push(data.data?.path || "/");
};
</script>

<style scoped>
/* ==================== 容器样式 ==================== */
#micro-content {
  height: 100%;
  width: 100%;
  position: relative;
  border: 2px solid #28a745;
}

#micro-content::before {
  content: "主应用容器 - 为子应用提供空间";
  position: absolute;
  top: 10px;
  left: 10px;
  background: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}

micro-app {
  height: 100%;
  width: 100%;
}

/* ==================== 错误状态样式 ==================== */
.error-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-content {
  text-align: center;
  color: #606266;
}

.error-icon {
  color: #f56c6c;
  margin-bottom: 16px;
}

.error-text {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #606266;
}

/* ==================== 加载状态样式 ==================== */
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #606266;
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: #409eff;
  margin-bottom: 16px;
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
