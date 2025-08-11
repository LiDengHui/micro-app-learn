<template>
  <div id="micro-content">
    <micro-app
      :name="appName"
      :url="appUrl"
      :baseroute="baseroute"
      :default-page="navigationStore.targetPath"
      iframe
      ssr
      @created="handleCreated"
      @beforemount="handleBeforemount"
      @mounted="handleMounted"
      @afterhidden="handleAfterhidden"
      @beforeshow="handleBeforeshow"
      @aftershow="handleAftershow"
      @error="handleError"
      @unmount="handleUnmount"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import microApp from "@micro-zoe/micro-app";
import { useNavigationStore } from "../stores/navigation";
import { onUnmounted } from "vue";
// ==================== 类型定义 ====================
interface Props {
  appName: string;
  appUrl: string;
  baseroute: string;
}

// ==================== 组合式函数 ====================
const props = defineProps<Props>();

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
};

/**
 * 处理子应用挂载完成
 */
const handleMounted = () => {
  console.log("handleMounted");
  // 子应用挂载完成，设置准备就绪状态
  navigationStore.setAppName(props.appName);
  navigationStore.setAppUrl(props.appUrl);
  navigationStore.setAppReady(props.appName, true);
};

/**
 * 处理子应用推入后台
 */
const handleAfterhidden = () => {
  console.log("handleAfterhidden");
};

/**
 * 处理子应用即将推入前台
 */
const handleBeforeshow = () => {
  console.log("handleBeforeshow");
};

/**
 * 处理子应用已推入前台
 */
const handleAftershow = () => {
  console.log("handleAftershow");
};

/**
 * 处理子应用渲染错误
 */
const handleError = (error: any) => {
  console.log("handleError", error);
  // 发生错误时重置准备状态
  navigationStore.setAppReady(props.appName, false);
};

/**
 * 处理子应用卸载
 */
const handleUnmount = () => {
  console.log("handleUnmount", props.appName, false);
  navigationStore.setAppReady(props.appName, false);
};

onUnmounted(() => {
  console.log("onUnmounted", props.appName, false);
  navigationStore.setAppReady(props.appName, false);
});
</script>

<style scoped>
/* ==================== 容器样式 ==================== */
#micro-content {
  height: 100%;
  width: 100%;
  position: relative;
}

micro-app {
  height: 100%;
  width: 100%;
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
