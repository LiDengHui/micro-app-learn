<template>
  <div class="vue-sub-app">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>Vue 子应用 - 首页</span>
          <el-tag type="success">使用主应用的 Element Plus</el-tag>
        </div>
      </template>
      
      <div class="content">
        <div class="logos">
          <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
          </a>
        </div>
        
        <HelloWorld msg="Vite + Vue + Element Plus + Vue Router" />
        
        <div class="navigation-demo">
          <el-divider>页面导航</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button type="primary" @click="$router.push('/orders')">
                订单管理
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="success" @click="$router.push('/users')">
                用户管理
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <div class="element-demo">
          <el-divider>Element Plus 组件演示</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
            </el-col>
            <el-col :span="12">
              <el-input v-model="inputValue" placeholder="请输入内容" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'

const inputValue = ref('')
</script>

<style scoped>
.vue-sub-app {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  text-align: center;
}

.logos {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.navigation-demo {
  margin-top: 30px;
}

.navigation-demo .el-button {
  margin: 10px;
}

.element-demo {
  margin-top: 30px;
  text-align: left;
}

.element-demo .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.element-demo .el-input {
  margin-top: 10px;
}
</style>
