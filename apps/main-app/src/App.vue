<template>
  <div class="container">
    <el-header class="header">
      <div class="header-content">
        <h1 class="logo">Micro-App Framework</h1>

        <el-menu
          :default-active="currentRoute"
          mode="horizontal"
          class="main-nav"
          router
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
      <router-view />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

interface MenuItem {
  title: string;
  moduleUrl: string;
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
    children: [{ title: "sub-app-react", moduleUrl: "/react" }],
  },
  {
    title: "Vue子应用",
    children: [
      {
        title: "订单管理",
        moduleUrl: "/vue",
        children: [
          { title: "订单列表", moduleUrl: "/vue/orders" },
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

const currentRoute = computed(() => route.path);
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
