<template>
  <div class="sub-app-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()" icon="ArrowLeft"> 返回 </el-button>
        <h2 class="page-title">子应用详情</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit" :disabled="!subAppDetail">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button
          type="danger"
          @click="handleDelete"
          :disabled="!subAppDetail"
        >
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 详情内容 -->
    <div v-else-if="subAppDetail" class="detail-container">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </span>
          </div>
        </template>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="应用名称">
            <span class="app-name">{{ subAppDetail.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="版本号">
            <el-tag type="info">{{ subAppDetail.version }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(subAppDetail.status)">
              {{ getStatusText(subAppDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{
              subAppDetail.fileSize
                ? formatFileSize(subAppDetail.fileSize)
                : "未知"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ subAppDetail.description || "暂无描述" }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 文件信息卡片 -->
      <el-card class="file-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Document /></el-icon>
              文件信息
            </span>
          </div>
        </template>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="包文件路径">
            <el-input :value="subAppDetail.packagePath" readonly size="small">
              <template #append>
                <el-button @click="copyToClipboard(subAppDetail.packagePath)">
                  复制
                </el-button>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="配置文件路径">
            {{ subAppDetail.configPath || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="入口文件">
            {{ subAppDetail.entryPoint || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="文件校验和">
            <el-input
              :value="subAppDetail.checksum || '无'"
              readonly
              size="small"
            >
              <template #append>
                <el-button
                  @click="copyToClipboard(subAppDetail.checksum || '')"
                >
                  复制
                </el-button>
              </template>
            </el-input>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 配置信息卡片 -->
      <el-card v-if="subAppDetail.config" class="config-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Setting /></el-icon>
              配置信息
            </span>
            <el-button
              type="primary"
              size="small"
              @click="
                copyToClipboard(JSON.stringify(subAppDetail.config, null, 2))
              "
            >
              复制配置
            </el-button>
          </div>
        </template>

        <div class="config-content">
          <pre>{{ JSON.stringify(subAppDetail.config, null, 2) }}</pre>
        </div>
      </el-card>

      <!-- 元数据卡片 -->
      <el-card class="meta-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><DataAnalysis /></el-icon>
              元数据
            </span>
          </div>
        </template>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="创建者">
            {{ subAppDetail.creator || "未知" }}
          </el-descriptions-item>
          <el-descriptions-item label="更新者">
            {{ subAppDetail.updater || "未知" }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{
              subAppDetail.createdAt
                ? formatDate(subAppDetail.createdAt)
                : "未知"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{
              subAppDetail.updatedAt
                ? formatDate(subAppDetail.updatedAt)
                : "未知"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ subAppDetail.sort || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="是否删除">
            <el-tag :type="subAppDetail.isDeleted ? 'danger' : 'success'">
              {{ subAppDetail.isDeleted ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 操作卡片 -->
      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Operation /></el-icon>
              操作
            </span>
          </div>
        </template>

        <div class="action-buttons">
          <el-button
            v-if="subAppDetail.status === 'active'"
            type="warning"
            @click="handleToggleStatus('inactive')"
          >
            <el-icon><VideoPause /></el-icon>
            停用应用
          </el-button>
          <el-button
            v-else
            type="success"
            @click="handleToggleStatus('active')"
          >
            <el-icon><VideoPlay /></el-icon>
            启用应用
          </el-button>
          <el-button type="primary" @click="handleUploadNewVersion">
            <el-icon><Upload /></el-icon>
            上传新版本
          </el-button>
          <el-button type="info" @click="handleViewVersionHistory">
            <el-icon><Clock /></el-icon>
            查看版本历史
          </el-button>
          <el-button type="info" @click="handleViewLogs">
            <el-icon><Document /></el-icon>
            查看日志
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-empty description="未找到子应用信息">
        <el-button type="primary" @click="$router.back()"> 返回列表 </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Edit,
  Delete,
  InfoFilled,
  Document,
  Setting,
  DataAnalysis,
  Operation,
  VideoPause,
  VideoPlay,
  Upload,
  Clock,
} from "@element-plus/icons-vue";
import {
  getSubAppDetail,
  deleteSubApp,
  updateSubAppStatus,
  type SubAppInfo,
} from "../api/subApp";

// ==================== 响应式数据 ====================
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const subAppDetail = ref<SubAppInfo | null>(null);

// ==================== 方法定义 ====================

/**
 * 加载子应用详情
 */
const loadSubAppDetail = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error("缺少子应用ID");
    router.push("/sub-app-management");
    return;
  }

  loading.value = true;
  try {
    const response = await getSubAppDetail(id);
    if (response.code === 200) {
      subAppDetail.value = response.data;
    } else {
      ElMessage.error(response.message || "获取详情失败");
      router.push("/sub-app-management");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
    router.push("/sub-app-management");
  } finally {
    loading.value = false;
  }
};

/**
 * 处理编辑
 */
const handleEdit = () => {
  ElMessage.info("编辑功能开发中...");
  // TODO: 实现编辑功能
};

/**
 * 处理删除
 */
const handleDelete = async () => {
  if (!subAppDetail.value) return;

  try {
    await ElMessageBox.confirm(
      `确定要删除子应用 "${subAppDetail.value.name}" 吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const response = await deleteSubApp(subAppDetail.value.id.toString());
    if (response.code === 200) {
      ElMessage.success("删除成功");
      router.push("/sub-app-management");
    } else {
      ElMessage.error(response.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

/**
 * 处理状态切换
 */
const handleToggleStatus = async (status: "active" | "inactive") => {
  if (!subAppDetail.value) return;

  try {
    const response = await updateSubAppStatus(
      subAppDetail.value.id.toString(),
      status
    );
    if (response.code === 200) {
      ElMessage.success(`${status === "active" ? "启用" : "停用"}成功`);
      // 重新加载详情
      await loadSubAppDetail();
    } else {
      ElMessage.error(response.message || "操作失败");
    }
  } catch (error) {
    console.error("状态切换失败:", error);
    ElMessage.error("操作失败");
  }
};

/**
 * 处理上传新版本
 */
const handleUploadNewVersion = () => {
  ElMessage.info("上传新版本功能开发中...");
  // TODO: 实现上传新版本功能
};

/**
 * 处理查看版本历史
 */
const handleViewVersionHistory = () => {
  if (subAppDetail.value) {
    router.push(`/sub-app-version-history/${subAppDetail.value.id}`);
  }
};

/**
 * 处理查看日志
 */
const handleViewLogs = () => {
  ElMessage.info("查看日志功能开发中...");
  // TODO: 实现查看日志功能
};

/**
 * 复制到剪贴板
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("复制成功");
  } catch (error) {
    console.error("复制失败:", error);
    ElMessage.error("复制失败");
  }
};

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: string | number): string => {
  const numBytes = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (numBytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 格式化日期
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("zh-CN");
};

/**
 * 获取状态类型
 */
const getStatusType = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "success",
    inactive: "info",
    error: "danger",
  };
  return statusMap[status] || "info";
};

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "活跃",
    inactive: "非活跃",
    error: "错误",
  };
  return statusMap[status] || "未知";
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadSubAppDetail();
});
</script>

<style scoped>
.sub-app-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-container,
.error-container {
  padding: 40px;
  text-align: center;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.file-card,
.config-card,
.meta-card,
.action-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-name {
  font-weight: 600;
  color: #409eff;
}

.config-content {
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
}

.config-content pre {
  margin: 0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-buttons .el-button {
  min-width: 120px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
