<template>
  <div id="micro-content">
    <micro-app
      :name="appName"
      :url="appUrl"
      :baseroute="baseroute"
      :default-page="navigationStore.defaultPage"
      iframe
      ssr
      @mounted="handleMounted"
      @unmount="handleUnmount"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import microApp from "@micro-zoe/micro-app";
import { useNavigationStore } from "../stores/navigation";

interface Props {
  appName: string;
  appUrl: string;
  baseroute: string;
}

const props = defineProps<Props>();
const navigationStore = useNavigationStore();

const handleMounted = () => {
  // 标记子应用已准备就绪
  const microAppElement = document.querySelector(
    `micro-app[name="${props.appName}"]`
  );
  if (microAppElement) {
    microAppElement.setAttribute("data-ready", "true");
  }

  // 子应用加载完成后，检查是否有目标路径需要跳转
  const targetPath = navigationStore.getTargetPath();

  if (targetPath) {
  }

  // 清除 defaultPage，因为已经通过 props 传递
};

const handleUnmount = () => {
  // 清除子应用状态
  const microAppElement = document.querySelector(
    `micro-app[name="${props.appName}"]`
  );
  if (microAppElement) {
    microAppElement.removeAttribute("data-ready");
  }

  // 清除存储的路径
};

onMounted(() => {
  // 监听子应用路由变化
  microApp.addDataListener(props.appName, (data: any) => {
    console.log(`${props.appName} data:`, data);
  });
});
</script>

<style scoped>
#micro-content {
  height: 100%;
  width: 100%;
}

micro-app {
  height: 100%;
  width: 100%;
}
</style>
