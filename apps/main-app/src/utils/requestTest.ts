import api from "./request";

// 测试新的request配置
export const testRequestConfig = () => {
  console.log("✅ 新的request配置已加载");
  console.log("- baseURL:", api.defaults.baseURL);
  console.log("- timeout:", api.defaults.timeout);
  console.log("- withCredentials:", api.defaults.withCredentials);

  // 测试请求拦截器
  console.log("- 请求拦截器数量:", api.interceptors.request.handlers.length);

  // 测试响应拦截器
  console.log("- 响应拦截器数量:", api.interceptors.response.handlers.length);
};

// 测试API调用
export const testApiCall = async () => {
  try {
    // 测试一个简单的GET请求
    const response = await api.get("/admin/auth/profile");
    console.log("✅ API调用成功:", response);
    return response;
  } catch (error) {
    console.log("⚠️ API调用失败 (这是正常的，因为可能没有登录):", error);
    return null;
  }
};
