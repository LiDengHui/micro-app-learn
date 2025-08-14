import { ElMessage } from "element-plus";

// 声明全局 micro-app 类型
declare global {
  interface Window {
    __MICRO_APP_ENVIRONMENT__?: boolean;
    microApp?: {
      dispatch: (data: any) => void;
    };
  }
}

/**
 * 向主应用发送复制信号
 * @param text 要复制的文本
 * @param successMessage 成功提示消息
 * @param _errorMessage 错误提示消息
 */
export const copyToClipboard = async (
  text: string,
  successMessage: string = "复制成功",
  _errorMessage: string = "复制失败"
): Promise<boolean> => {
  try {
    // 检查是否在微前端环境中
    if (window.__MICRO_APP_ENVIRONMENT__ && window.microApp) {
      // 向主应用发送复制信号
      window.microApp.dispatch({
        name: "copy-to-clipboard",
        data: {
          text,
          successMessage,
          errorMessage: _errorMessage,
        },
      });

      // 显示成功提示（主应用会处理实际的复制操作）
      ElMessage.success(successMessage);
      return true;
    } else {
      // 非微前端环境，使用本地复制方案
      return await localCopyToClipboard(text, successMessage, _errorMessage);
    }
  } catch (error) {
    console.error("发送复制信号失败:", error);

    // 如果发送失败，提供手动复制的提示
    ElMessage({
      message: `${_errorMessage}，请手动复制：${text}`,
      type: "warning",
      duration: 5000,
      showClose: true,
    });
    return false;
  }
};

/**
 * 本地复制文本到剪贴板（降级方案）
 * @param text 要复制的文本
 * @param successMessage 成功提示消息
 * @param _errorMessage 错误提示消息
 */
const localCopyToClipboard = async (
  text: string,
  successMessage: string = "复制成功",
  _errorMessage: string = "复制失败"
): Promise<boolean> => {
  try {
    // 首先尝试使用现代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      ElMessage.success(successMessage);
      return true;
    }

    // 降级方案：使用传统的 document.execCommand
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      ElMessage.success(successMessage);
      return true;
    } else {
      throw new Error("document.execCommand 复制失败");
    }
  } catch (error) {
    console.error("本地复制失败:", error);
    throw error;
  }
};

/**
 * 复制文本到剪贴板（简化版本）
 * @param text 要复制的文本
 */
export const copyText = (text: string): Promise<boolean> => {
  return copyToClipboard(text);
};
