<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h1 class="login-title">欢迎使用微前端管理系统</h1>
        <p class="login-subtitle">统一认证登录</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="authStore.loginLoading"
            @click="handleLogin"
          >
            {{ authStore.loginLoading ? "登录中..." : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p class="demo-account">
          <span>演示账号：</span>
          <el-button link @click="fillDemoAccount('admin')"
            >admin/admin</el-button
          >
          <el-button link @click="fillDemoAccount('test')">test/test</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElForm, ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useAuthStore } from "../stores/auth";
import type { LoginForm } from "../types/auth";

// ==================== 组合式函数 ====================
const router = useRouter();
const authStore = useAuthStore();

// ==================== 响应式数据 ====================
const loginFormRef = ref<InstanceType<typeof ElForm>>();

const loginForm = reactive<LoginForm>({
  username: "",
  password: "",
});

const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "用户名长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 4, max: 20, message: "密码长度在 4 到 20 个字符", trigger: "blur" },
  ],
};

// ==================== 方法定义 ====================

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    await authStore.login(loginForm);

    // 登录成功，跳转到首页
    await router.push("/");
  } catch (error: any) {
    if (error.errors) {
      // 表单验证错误
      return;
    }
    console.error("登录失败:", error);
  }
};

/**
 * 填充演示账号
 */
const fillDemoAccount = (type: "admin" | "test") => {
  loginForm.username = type;
  loginForm.password = type;
};

// ==================== 生命周期 ====================
onMounted(() => {
  // 如果已经登录，直接跳转到首页
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateY(0);
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out;
}

.login-form-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}

.login-footer {
  text-align: center;
}

.demo-account {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.demo-account span {
  margin-right: 8px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
