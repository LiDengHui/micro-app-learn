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
                :index="item.moduleUrl"
              >
                {{ item.title }}
              </el-menu-item>

              <el-sub-menu v-else :index="item.title">
                <template #title>{{ item.title }}</template>

                <el-menu-item
                  v-for="subItem in item.children"
                  :key="subItem.title"
                  :index="subItem.moduleUrl"
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
      <div id="micro-content">
        <micro-app
          v-if="currentRoute === '/react'"
          name="react-app"
          url="http://localhost:7101"
          baseroute="/react"
          iframe
          ssr
        ></micro-app>
        <micro-app
          v-else-if="currentRoute === '/vue'"
          name="vue-app"
          url="http://localhost:7102"
          baseroute="/vue"
          iframe
          ssr
        ></micro-app>
        <micro-app
          v-else-if="currentRoute === '/vue/orders'"
          name="vue-orders-app"
          url="http://localhost:7102/orders"
          baseroute="/vue/orders"
        ></micro-app>
        <micro-app
          v-else-if="currentRoute === '/vue/users'"
          name="vue-users-app"
          url="http://localhost:7102/users"
          baseroute="/vue/users"
        ></micro-app>
        <div v-else class="welcome-content">
          <h2>Welcome to Micro-App Framework</h2>
          <p>Please select an application from the menu to get started.</p>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface MenuItem {
  title: string;
  moduleUrl: string;
  children?: MenuItem[];
}

interface MenuGroup {
  title: string;
  children: MenuItem[];
}

const currentRoute = ref<string>("");

const menuData = ref<MenuGroup[]>([
  {
    title: "React子应用",
    children: [{ title: "sub-app-react", moduleUrl: "/react" }],
  },
  {
    title: "Vue子应用",
    children: [
      {
        title: "订单管理",
        moduleUrl: "/vue",
        children: [
          { title: "订单列表", moduleUrl: "/vue" },
          { title: "用户管理", moduleUrl: "/vue/users" },
        ],
      },
      { title: "产品管理", moduleUrl: "/vue/products" },
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

const handleMenuSelect = (index: string) => {
  if (index.startsWith("http")) {
    // External links
    window.open(index, "_blank");
  } else {
    // Internal micro-app routes
    currentRoute.value = index;
    history.replaceState({ page: window.location.pathname }, "", index);
  }
};

onMounted(() => {
  // Set initial route based on current URL
  const path = window.location.pathname;
  if (
    path === "/react" ||
    path === "/vue" ||
    path === "/vue/orders" ||
    path === "/vue/users"
  ) {
    currentRoute.value = path;
  }
});
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
  overflow: hidden;
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
