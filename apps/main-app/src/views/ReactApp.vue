<template>
  <div id="micro-content">
    <micro-app
      name="react-app"
      url="http://localhost:7101"
      iframe
      ssr
      @mounted="handleMounted"
      @unmount="handleUnmount"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
import microApp from "@micro-zoe/micro-app";

const handleMounted = () => {
  // 标记子应用已准备就绪
  const microAppElement = document.querySelector('micro-app[name="react-app"]');
  if (microAppElement) {
    microAppElement.setAttribute("data-ready", "true");
  }

  // 子应用加载完成后，检查是否有目标路径需要跳转
  const targetPath = sessionStorage.getItem("targetPath");
  if (targetPath) {
    // 延迟执行，确保子应用完全初始化
    setTimeout(() => {
      try {
        microApp.router.push({
          name: "react-app",
          path: targetPath,
        });
        // 清除存储的路径
        sessionStorage.removeItem("targetPath");
      } catch (error) {
        console.error("React app navigation failed:", error);
        sessionStorage.removeItem("targetPath");
      }
    }, 200);
  }
};

const handleUnmount = () => {
  // 清除子应用状态
  const microAppElement = document.querySelector('micro-app[name="react-app"]');
  if (microAppElement) {
    microAppElement.removeAttribute("data-ready");
  }
};
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
