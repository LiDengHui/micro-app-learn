<template>
  <div class="container">
    <!-- 头部导航 -->
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

    <!-- 主内容区域 -->
    <el-main class="content">
      <router-view />
    </el-main>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { subApps } from "./config/subApps";
import { useNavigationStore } from "./stores/navigation";

// ==================== 类型定义 ====================
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

// ==================== 组合式函数 ====================
const route = useRoute();
const router = useRouter();
const navigationStore = useNavigationStore();

// ==================== 响应式数据 ====================
const currentRoute = computed(() => route.path);

const menuData = ref<MenuGroup[]>([
  {
    title: subApps["react-app"].title,
    children: [
      { title: "sub-app-react", name: subApps["react-app"].name, path: "/" },
    ],
  },
  {
    title: subApps["vue-app"].title,
    children: [
      {
        title: "订单管理",
        name: subApps["vue-app"].name,
        path: "/",
        children: [
          { title: "订单列表", name: subApps["vue-app"].name, path: "/orders" },
          { title: "用户管理", name: subApps["vue-app"].name, path: "/users" },
        ],
      },
      { title: "产品管理", name: subApps["vue-app"].name, path: "/products" },
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

// ==================== 生命周期 ====================
onMounted(() => {
  handleDirectRoute();
});

// ==================== 方法定义 ====================

/**
 * 处理菜单选择
 */
const handleMenuSelect = (index: string) => {
  if (!index.includes(":")) return;

  const [appName, appPath] = index.split(":");
  console.log("Menu selected:", appName, appPath);

  // 设置导航状态
  navigationStore.setDefaultPage(appPath);
  navigationStore.setCurrentApp(appName);

  // 检查子应用状态并导航
  navigateToSubApp(appName, appPath);
};

/**
 * 导航到子应用
 */
const navigateToSubApp = (appName: string, appPath: string) => {
  const isAppReady = navigationStore.getAppReady(appName);
  console.log("isAppReady", isAppReady);
  if (isAppReady) {
    // 子应用已准备就绪，直接导航
    try {
      navigationStore.setTargetPath(appPath);
      console.log("navigateToSubApp", appName, appPath);
      microApp.router.push({ name: appName, path: appPath });
    } catch (error) {
      console.error("Navigation failed:", error);
      handleFallbackNavigation(appName, appPath);
    }
  } else {
    // 子应用未准备就绪，使用备用方法
    handleFallbackNavigation(appName, appPath);
  }
};

/**
 * 备用导航方法
 */
const handleFallbackNavigation = (appName: string, appPath: string) => {
  const appConfig = subApps[appName];
  if (!appConfig) return;

  navigationStore.setTargetPath(appPath);
  router.push(appConfig.baseroute);
};

/**
 * 处理直接访问子应用路由的情况
 */
const handleDirectRoute = () => {
  console.log("Direct route accessed:", route.path);
};
</script>

<style scoped>
/* ==================== 布局样式 ==================== */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* ==================== 头部样式 ==================== */
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
  font-size: 1.5.5rem;
  font-weight: 600;
  color: white;
}

/* ==================== 导航样式 ==================== */
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

/* ==================== 内容区域样式 ==================== */
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
</style>
