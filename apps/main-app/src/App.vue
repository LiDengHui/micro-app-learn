<template>
  <div class="container">
    <el-header class="header">
      <div class="header-content">
        <h1 class="logo">Micro-App Framework</h1>

        <el-menu
          :default-active="currentRoute"
          mode="horizontal"
          class="main-nav"
          @select="handleMenuSelect"
        >
          <el-sub-menu
            v-for="group in menuData"
            :key="group.title"
            :index="group.title"
          >
            <template #title>
              <span>{{ group.title }}</span>
            </template>

            <template v-for="item in group.children" :key="item.title">
              <el-menu-item
                v-if="!item.children || item.children.length === 0"
                :index="item.name + ':' + item.path"
              >
                {{ item.title }}
              </el-menu-item>

              <el-sub-menu v-else :index="item.title">
                <template #title>{{ item.title }}</template>

                <el-menu-item
                  v-for="subItem in item.children"
                  :key="subItem.title"
                  :index="subItem.name + ':' + subItem.path"
                >
                  {{ subItem.title }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-header>

    <el-main class="content">
      <router-view />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import microApp from "@micro-zoe/micro-app";
interface MenuItem {
  title: string;
  name?: string;
  path?: string;
  moduleUrl?: string;
  children?: MenuItem[];
}

interface MenuGroup {
  title: string;
  children: MenuItem[];
}

const route = useRoute();

const menuData = ref<MenuGroup[]>([
  {
    title: "React子应用",
    children: [{ title: "sub-app-react", name: "react-app", path: "/" }],
  },
  {
    title: "Vue子应用",
    children: [
      {
        title: "订单管理",
        name: "vue-app",
        path: "/",
        children: [
          { title: "订单列表", name: "vue-app", path: "/orders" },
          { title: "用户管理", name: "vue-app", path: "/users" },
        ],
      },
      { title: "产品管理", name: "vue-app", path: "/products" },
    ],
  },
  {
    title: "系统设置",
    children: [
      {
        title: "基础设置",
        moduleUrl: "https://example.com/settings",
        children: [
          {
            title: "系统配置",
            moduleUrl: "https://example.com/settings/config",
          },
          {
            title: "用户权限",
            moduleUrl: "https://example.com/settings/permissions",
          },
        ],
      },
      { title: "安全中心", moduleUrl: "https://example.com/security" },
    ],
  },
]);

const currentRoute = computed(() => route.path);

onMounted(() => {
  handleDirectRoute();
});

const handleMenuSelect = (index: string) => {
  if (index.includes(":")) {
    const [appName, appPath] = index.split(":");
    console.log("Menu selected:", appName, appPath);

    // 检查子应用是否已经渲染并且准备就绪
    const microAppElement = document.querySelector(
      `micro-app[name="${appName}"]`
    );

    if (
      microAppElement &&
      microAppElement.getAttribute("data-ready") === "true"
    ) {
      // 子应用已准备就绪，直接导航
      try {
        microApp.router.push({
          name: appName,
          path: appPath,
        });
      } catch (error) {
        console.error("Navigation failed:", error);
        // 如果导航失败，使用备用方法
        handleFallbackNavigation(appName, appPath);
      }
    } else {
      // 子应用未准备就绪，使用备用方法
      handleFallbackNavigation(appName, appPath);
    }
  }
};

const router = useRouter(); // 备用导航方法
const handleFallbackNavigation = (appName: string, appPath: string) => {
  if (appName === "react-app") {
    router.push("/react");
    // 存储目标路径，等待子应用加载完成后跳转
    sessionStorage.setItem("targetPath", appPath);
  } else if (appName === "vue-app") {
    router.push("/vue");
    // 存储目标路径，等待子应用加载完成后跳转
    sessionStorage.setItem("targetPath", appPath);
  }
};

// 处理直接访问子应用路由的情况
const handleDirectRoute = () => {
  // 由于现在直接通过路由跳转，这个函数可以简化或移除
  // 子应用会自动处理路由变化
  console.log("Direct route accessed:", route.path);
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background: #2c3e50;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  background: transparent !important;
  border-bottom: none !important;
}

.main-nav :deep(.el-menu) {
  background: transparent !important;
  border-bottom: none !important;
}

.main-nav :deep(.el-menu-item),
.main-nav :deep(.el-sub-menu__title) {
  color: white !important;
}

.main-nav :deep(.el-menu-item:hover),
.main-nav :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #3498db !important;
}

.main-nav :deep(.el-menu-item.is-active) {
  background-color: #3498db !important;
  color: white !important;
}

.content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: 0;
}

#micro-content {
  height: 100%;
  width: 100%;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #6c757d;
}

.welcome-content h2 {
  margin-bottom: 1rem;
  color: #495057;
}

micro-app {
  height: 100%;
  width: 100%;
}
</style>
