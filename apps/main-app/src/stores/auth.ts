import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  LoginForm,
  LoginResponse,
  UserInfo,
  LoginData,
} from "../types/auth";
import {
  login as loginAPI,
  logout as logoutAPI,
  getUserProfile,
} from "../api/auth";
import { ElMessage } from "element-plus";

export const useAuthStore = defineStore("auth", () => {
  // ==================== 状态定义 ====================
  const userInfo = ref<UserInfo | null>(null);
  const accessToken = ref<string>("");
  const refreshToken = ref<string>("");
  const isLoggedIn = ref<boolean>(false);
  const loginLoading = ref<boolean>(false);

  // ==================== 计算属性 ====================
  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && userInfo.value)
  );
  const currentUser = computed(() => userInfo.value);

  // ==================== 核心方法 ====================

  /**
   * 初始化认证状态
   */
  const initAuth = async () => {
    const storedToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedToken && storedRefreshToken) {
      accessToken.value = storedToken;
      refreshToken.value = storedRefreshToken;

      try {
        // 验证 token 并获取用户信息
        const profileResponse = await getUserProfile();
        if (profileResponse.data) {
          userInfo.value = profileResponse.data;
          isLoggedIn.value = true;
        } else {
          clearAuth();
        }
      } catch (error) {
        // token 无效，清除状态
        clearAuth();
      }
    }
  };

  /**
   * 登录
   */
  const login = async (loginForm: LoginForm) => {
    try {
      loginLoading.value = true;
      const response: LoginResponse = await loginAPI(loginForm);
      if (response.data) {
        const loginData: LoginData = response.data;

        // 保存用户信息和 token
        userInfo.value = {
          id: loginData.id,
          username: loginData.username,
          nickname: loginData.nickname,
          email: loginData.email,
          avatar: loginData.avatar,
        };

        accessToken.value = loginData.token.accessToken;
        refreshToken.value = loginData.token.refreshToken;
        isLoggedIn.value = true;

        // 持久化存储
        localStorage.setItem("accessToken", loginData.token.accessToken);
        localStorage.setItem("refreshToken", loginData.token.refreshToken);

        ElMessage.success("登录成功");
        return response;
      } else {
        throw new Error(response.errorMessage || "登录失败");
      }
    } catch (error: any) {
      ElMessage.error(
        error.message || error.response?.data?.errorMessage || "登录失败"
      );
      throw error;
    } finally {
      loginLoading.value = false;
    }
  };

  /**
   * 登出
   */
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("登出 API 调用失败:", error);
    } finally {
      clearAuth();
      ElMessage.success("已退出登录");
    }
  };

  /**
   * 清除认证状态
   */
  const clearAuth = () => {
    userInfo.value = null;
    accessToken.value = "";
    refreshToken.value = "";
    isLoggedIn.value = false;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  /**
   * 更新用户信息
   */
  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info };
    }
  };

  /**
   * 更新 token
   */
  const updateTokens = (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  // ==================== 导出 ====================
  return {
    // 状态
    userInfo,
    accessToken,
    refreshToken,
    isLoggedIn,
    loginLoading,

    // 计算属性
    isAuthenticated,
    currentUser,

    // 方法
    initAuth,
    login,
    logout,
    clearAuth,
    updateUserInfo,
    updateTokens,
  };
});
