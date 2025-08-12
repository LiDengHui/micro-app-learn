<template>
  <div class="container">
    <!-- 头部导航 -->
    <el-header class="header">
      <div class="header-content">
        <h1 class="logo">Micro-App Framework</h1>

        <el-menu
          ref="mainMenuRef"
          :default-active="menuActiveIndex"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import { subApps } from "./config/subApps";
import { useNavigationStore } from "./stores/navigation";
import eventBus from "./utils/eventBus";

// 扩展Window接口以支持microApp
declare global {
  interface Window {
    microApp?: {
      addDataListener: (listener: (data: any) => void) => void;
    };
  }
}

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

// 子应用路由变化数据类型
interface RouteChangeData {
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
const route = useRoute();
const router = useRouter();
const navigationStore = useNavigationStore();

// ==================== 响应式数据 ====================
const currentRoute = computed(() => route.path);
const mainMenuRef = ref<any>(null);
const activeMenuIndex = ref<string>("");

// ==================== 计算属性 ====================
const menuActiveIndex = computed(() => {
  // 优先使用子应用上报的菜单索引，否则使用当前路由
  return activeMenuIndex.value || currentRoute.value;
});

const menuData = ref<MenuGroup[]>([
  {
    title: subApps["react-app"].title,
    children: [
      {
        title: "订单管理",
        name: subApps["react-app"].name,
        path: "/",
        children: [
          {
            title: "订单列表",
            name: subApps["react-app"].name,
            path: "/orders",
          },
          {
            title: "用户管理",
            name: subApps["react-app"].name,
            path: "/users",
          },
        ],
      },
      { title: "产品管理", name: subApps["react-app"].name, path: "/products" },
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
  setupEventBusListener();
});

onUnmounted(() => {
  removeEventBusListener();
});

// ==================== 方法定义 ====================

/**
 * 处理菜单选择
 */
const handleMenuSelect = (index: string) => {
  if (!index.includes(":")) return;

  const [appName, appPath] = index.split(":");
  console.log("Menu selected:", appName, appPath);

  // 更新菜单激活状态
  activeMenuIndex.value = index;

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

/**
 * 更新当前菜单状态
 */
const updateCurrentMenu = (
  appName: string,
  menuTitle: string,
  menuPath: string
) => {
  console.log("更新菜单状态:", { appName, menuTitle, menuPath });

  try {
    // 根据子应用上报的信息查找对应的菜单项
    const menuIndex = findMenuIndexByInfo(appName, menuTitle, menuPath);

    if (menuIndex) {
      // 更新响应式数据
      activeMenuIndex.value = menuIndex;

      // 如果菜单组件已初始化，使用 updateActiveIndex 方法更新菜单选中项
      if (mainMenuRef.value) {
        mainMenuRef.value.updateActiveIndex(menuIndex);
        console.log("已更新菜单选中项:", menuIndex);
      } else {
        console.log("菜单组件未初始化，已更新响应式数据:", menuIndex);
      }
    } else {
      console.warn("未找到对应的菜单项:", { appName, menuTitle, menuPath });
    }
  } catch (error) {
    console.error("更新菜单状态失败:", error);
  }
};

/**
 * 处理菜单更新事件
 */
const handleMenuUpdate = (menuData: MenuUpdateEvent) => {
  console.log("主应用收到menu-update事件:", menuData);

  const { appName, path, menuTitle, menuPath } = menuData;

  // 更新当前菜单状态
  updateCurrentMenu(appName, menuTitle, menuPath);

  // 更新导航状态
  navigationStore.setTargetPath(path);
  navigationStore.setCurrentApp(appName);

  console.log("已处理menu-update事件");
};

/**
 * 设置eventBus监听器
 */
const setupEventBusListener = () => {
  // 监听menu-update事件
  eventBus.on("menu-update", handleMenuUpdate);
  console.log("已设置eventBus监听器");
};

/**
 * 移除eventBus监听器
 */
const removeEventBusListener = () => {
  // 移除menu-update事件监听
  eventBus.off("menu-update", handleMenuUpdate);
  console.log("已移除eventBus监听器");
};

/**
 * 根据子应用信息查找对应的菜单索引
 */
const findMenuIndexByInfo = (
  appName: string,
  menuTitle: string,
  menuPath: string
): string | null => {
  console.log("查找菜单索引:", { appName, menuTitle, menuPath });

  // 遍历菜单数据，查找匹配的菜单项
  for (const group of menuData.value) {
    for (const item of group.children) {
      // 检查一级菜单项
      if (
        item.name === appName &&
        item.title === menuTitle &&
        item.path === menuPath
      ) {
        const menuIndex = `${appName}:${menuPath}`;
        console.log("找到一级菜单项:", menuIndex);
        return menuIndex;
      }

      // 检查子菜单项
      if (item.children) {
        for (const subItem of item.children) {
          if (
            subItem.name === appName &&
            subItem.title === menuTitle &&
            subItem.path === menuPath
          ) {
            const menuIndex = `${appName}:${menuPath}`;
            console.log("找到子菜单项:", menuIndex);
            return menuIndex;
          }
        }
      }
    }
  }

  // 如果没有找到完全匹配的，尝试根据路径匹配
  for (const group of menuData.value) {
    for (const item of group.children) {
      if (item.name === appName && item.path === menuPath) {
        const menuIndex = `${appName}:${menuPath}`;
        console.log("根据路径找到菜单项:", menuIndex);
        return menuIndex;
      }

      if (item.children) {
        for (const subItem of item.children) {
          if (subItem.name === appName && subItem.path === menuPath) {
            const menuIndex = `${appName}:${menuPath}`;
            console.log("根据路径找到子菜单项:", menuIndex);
            return menuIndex;
          }
        }
      }
    }
  }

  console.log("未找到匹配的菜单项");
  return null;
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
