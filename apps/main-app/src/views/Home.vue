<template>
  <div class="welcome-content">
    <h1>欢迎使用微前端框架</h1>
    <p>这是一个基于 Vue 3 + TypeScript + Element Plus 的微前端解决方案</p>

    <!-- 测试按钮 -->
    <div class="test-buttons">
      <h3>快速测试</h3>
      <el-button type="primary" @click="testMenuManagement">
        测试菜单管理页面
      </el-button>
      <el-button type="success" @click="testUserManagement">
        测试用户管理页面
      </el-button>
      <el-button type="warning" @click="testRoleManagement">
        测试角色管理页面
      </el-button>
    </div>

    <div class="app-info">
      <h3>应用信息</h3>
      <p><strong>主应用:</strong> Vue 3 + TypeScript + Element Plus</p>
      <p><strong>子应用:</strong> React + Vue 3</p>
      <p><strong>通信:</strong> micro-app + EventBus</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { subApps } from "../config/subApps";

const router = useRouter();

const testMenuManagement = () => {
  console.log("测试菜单管理页面");
  // 直接导航到 Vue 子应用的菜单管理页面
  const appConfig = subApps["vue-app"];
  if (appConfig) {
    router.push(`${appConfig.baseroute}/menu-management`);
  }
};

const testUserManagement = () => {
  console.log("测试用户管理页面");
  // 直接导航到 Vue 子应用的用户管理页面
  const appConfig = subApps["vue-app"];
  if (appConfig) {
    router.push(`${appConfig.baseroute}/user-management`);
  }
};

const testRoleManagement = () => {
  console.log("测试角色管理页面");
  // 直接导航到 Vue 子应用的角色管理页面
  const appConfig = subApps["vue-app"];
  if (appConfig) {
    router.push(`${appConfig.baseroute}/role-management`);
  }
};
</script>

<style scoped>
.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.welcome-content h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.welcome-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
}

.test-buttons {
  margin: 2rem 0;
  padding: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.test-buttons h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.test-buttons .el-button {
  margin: 0.5rem;
}

.app-info {
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: left;
}

.app-info h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.app-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
