<template>
  <div class="container" :class="{ 'login-layout': isLoginPage }">
    <!-- 加载状态 -->
    <div v-if="!isInitialized" class="loading-screen">
      <div class="loading-spinner">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </div>

    <!-- 头部导航：仅在完成初始化且已登录时显示，避免闪烁 -->
    <el-header
      v-else-if="isInitialized && authStore.isAuthenticated"
      class="header"
    >
      <div class="header-content">
        <h1 class="logo">Micro-App Framework</h1>

        <MainMenu
          v-if="authStore.isAuthenticated"
          ref="mainMenuRef"
          :menu-data="menuData"
          :active-index="menuActiveIndex"
          @select="handleMenuSelect"
        />

        <!-- 用户信息区域 -->
        <div class="user-info">
          <el-dropdown @command="handleUserCommand">
            <span class="user-name">
              <el-icon><User /></el-icon>
              {{ authStore.currentUser?.username || "用户" }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主内容区域 -->
    <el-main
      v-if="isInitialized"
      class="content"
      :class="{ 'login-content': isLoginPage }"
    >
      <router-view />
    </el-main>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { User, ArrowDown, Loading } from "@element-plus/icons-vue";
import microApp from "@micro-zoe/micro-app";
import { subApps } from "./config/subApps";
import { buildMenuData, type MenuGroup } from "./config/menu";
import MainMenu from "./components/MainMenu.vue";
import { useNavigationStore } from "./stores/navigation";
import { useAuthStore } from "./stores/auth";
import eventBus from "./utils/eventBus";
import { MENU_UPDATE } from "./constants/events";

// 扩展Window接口以支持microApp
declare global {
  interface Window {
    microApp?: {
      addDataListener: (listener: (data: any) => void) => void;
    };
  }
}

// ==================== 类型定义 ====================

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
const authStore = useAuthStore();

// ==================== 响应式数据 ====================
const currentRoute = computed(() => route.path);
const mainMenuRef = ref<any>(null);
const activeMenuIndex = ref<string>("");
const isInitialized = ref(false);

// ==================== 计算属性 ====================
const menuActiveIndex = computed(() => {
  // 优先使用子应用上报的菜单索引，否则使用当前路由
  return activeMenuIndex.value || currentRoute.value;
});

const isLoginPage = computed(() => {
  // 初始化完成前，如果没有认证状态，则认为是登录页
  if (!isInitialized.value) {
    return !authStore.isAuthenticated;
  }
  return route.name === "Login";
});

const menuData = ref<MenuGroup[]>(buildMenuData());

// ==================== 生命周期 ====================
onMounted(async () => {
  // 初始化认证状态
  await initializeAuth();
  handleDirectRoute();
  setupEventBusListener();
  // 标记初始化完成
  isInitialized.value = true;
});

onUnmounted(() => {
  removeEventBusListener();
});

// ==================== 方法定义 ====================

/**
 * 初始化认证状态
 */
const initializeAuth = async () => {
  try {
    await authStore.initAuth();
  } catch (error) {
    console.error("初始化认证状态失败:", error);
  }
};

/**
 * 处理菜单选择
 */
const handleMenuSelect = (index: string) => {
  if (!index.includes(":")) return;

  const [appName, appPath] = index.split(":");
  console.log("Menu selected:", appName, appPath);

  // 更新菜单激活状态
  activeMenuIndex.value = index;

  // 如果是子应用路径，直接跳转
  if (appPath.startsWith("/sub-app/")) {
    router.push(appPath);
    return;
  }

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
  eventBus.on(MENU_UPDATE, handleMenuUpdate);
  console.log("已设置eventBus监听器");
};

/**
 * 移除eventBus监听器
 */
const removeEventBusListener = () => {
  // 移除menu-update事件监听
  eventBus.off(MENU_UPDATE, handleMenuUpdate);
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

/**
 * 处理用户操作命令
 */
const handleUserCommand = async (command: string) => {
  switch (command) {
    case "profile":
      // TODO: 打开个人资料页面
      console.log("打开个人资料");
      break;
    case "logout":
      await authStore.logout();
      // 登出后跳转到登录页
      router.push({ name: "Login" });
      break;
    default:
      break;
  }
};
</script>

<style scoped>
/* ==================== 布局样式 ==================== */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.container.login-layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.container.login-layout::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(120, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(120, 219, 255, 0.3) 0%,
      transparent 50%
    );
  pointer-events: none;
}

/* 科技感网格特效（轻微动画） */
.container.login-layout::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.06) 0px,
      rgba(255, 255, 255, 0.06) 1px,
      transparent 1px,
      transparent 40px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 40px
    );
  animation: gridMove 20s linear infinite;
  mix-blend-mode: overlay;
  pointer-events: none;
}

@keyframes gridMove {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 0 40px, 40px 0;
  }
}

/* ==================== 加载屏幕样式 ==================== */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.loading-spinner .el-icon {
  font-size: 40px;
  margin-bottom: 16px;
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
  gap: 1rem;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
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

/* ==================== 用户信息样式 ==================== */
.user-info {
  flex-shrink: 0;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-name:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* ==================== 内容区域样式 ==================== */
.content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: 0;
}

.content.login-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* 登录页使 el-main 背景透明，避免遮挡渐变背景 */
.container.login-layout .content {
  background: transparent !important;
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
