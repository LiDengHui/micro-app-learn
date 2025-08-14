<template>
  <div class="list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()" icon="ArrowLeft"> 返回 </el-button>
        <h1>版本历史</h1>
        <el-tag v-if="subAppInfo" type="info" size="large">
          {{ subAppInfo.name }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="handleUploadNewVersion"
          :disabled="!subAppInfo"
        >
          <el-icon><Upload /></el-icon>
          上传新版本
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 版本历史内容 -->
    <div v-else class="version-history-container">
      <!-- 搜索和筛选 -->
      <el-card class="search-card" shadow="hover">
        <el-form :model="searchForm" inline>
          <el-form-item label="版本号">
            <el-input
              v-model="searchForm.version"
              placeholder="请输入版本号"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="活跃" value="active" />
              <el-option label="非活跃" value="inactive" />
              <el-option label="已废弃" value="deprecated" />
            </el-select>
          </el-form-item>
          <el-form-item label="当前版本">
            <el-select
              v-model="searchForm.isCurrentVersion"
              placeholder="请选择"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 版本列表 -->
      <el-card class="version-list-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Clock /></el-icon>
              版本历史列表
            </span>
            <el-button
              type="primary"
              @click="loadVersionList"
              :loading="loading"
            >
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </template>

        <el-table
          v-loading="loading"
          :data="versionList"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="version" label="版本号" width="120">
            <template #default="{ row }">
              <div class="version-info">
                <span class="version-number">{{ row.version }}</span>
                <el-tag v-if="row.isCurrentVersion" type="success" size="small">
                  当前版本
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="description"
            label="版本描述"
            min-width="200"
            show-overflow-tooltip
          />

          <el-table-column prop="fileSize" label="文件大小" width="120">
            <template #default="{ row }">
              {{ row.fileSize ? formatFileSize(row.fileSize) : "未知" }}
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getVersionStatusType(row.status)">
                {{ getVersionStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="creator" label="创建者" width="100" />

          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              {{ row.createdAt ? formatDate(row.createdAt) : "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <TableActionButtons :max-visible="1">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleViewVersionDetail(row)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-if="!row.isCurrentVersion && row.status !== 'deprecated'"
                  size="small"
                  type="success"
                  @click="handleRollback(row)"
                >
                  回滚到此版本
                </el-button>
                <el-button
                  v-if="!row.isCurrentVersion"
                  size="small"
                  type="warning"
                  @click="handleUpdateStatus(row)"
                >
                  更新状态
                </el-button>
                <el-button
                  v-if="!row.isCurrentVersion"
                  size="small"
                  type="danger"
                  @click="handleDeleteVersion(row)"
                >
                  删除
                </el-button>
              </TableActionButtons>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.limit"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 版本详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="版本详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-loading="detailLoading" class="version-detail-content">
        <el-descriptions v-if="currentVersion" :column="2" border size="large">
          <el-descriptions-item label="版本号">
            <span class="version-number">{{ currentVersion.version }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getVersionStatusType(currentVersion.status)">
              {{ getVersionStatusText(currentVersion.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{
              currentVersion.fileSize
                ? formatFileSize(currentVersion.fileSize)
                : "未知"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="是否为当前版本">
            <el-tag
              :type="currentVersion.isCurrentVersion ? 'success' : 'info'"
            >
              {{ currentVersion.isCurrentVersion ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="版本描述" :span="2">
            {{ currentVersion.description || "暂无描述" }}
          </el-descriptions-item>
          <el-descriptions-item label="包文件路径">
            {{ currentVersion.packagePath }}
          </el-descriptions-item>
          <el-descriptions-item label="配置文件路径">
            {{ currentVersion.configPath || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="入口文件">
            {{ currentVersion.entryPoint || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="文件校验和">
            {{ currentVersion.checksum || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="创建者">
            {{ currentVersion.creator || "未知" }}
          </el-descriptions-item>
          <el-descriptions-item label="更新者">
            {{ currentVersion.updater || "未知" }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{
              currentVersion.createdAt
                ? formatDate(currentVersion.createdAt)
                : "未知"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{
              currentVersion.updatedAt
                ? formatDate(currentVersion.updatedAt)
                : "未知"
            }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 发布说明 -->
        <div v-if="currentVersion?.releaseNotes" class="release-notes-section">
          <h4>发布说明</h4>
          <el-card shadow="never" class="release-notes-card">
            <pre>{{ currentVersion.releaseNotes }}</pre>
          </el-card>
        </div>

        <!-- 配置信息 -->
        <div v-if="currentVersion?.config" class="config-section">
          <h4>配置信息</h4>
          <el-card shadow="never" class="config-card">
            <pre>{{ JSON.stringify(currentVersion.config, null, 2) }}</pre>
          </el-card>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 状态更新对话框 -->
    <el-dialog v-model="statusDialogVisible" title="更新版本状态" width="500px">
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="版本号">
          <span>{{ currentVersion?.version }}</span>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag :type="getVersionStatusType(currentVersion?.status || '')">
            {{ getVersionStatusText(currentVersion?.status || "") }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="statusForm.status" placeholder="请选择新状态">
            <el-option label="活跃" value="active" />
            <el-option label="非活跃" value="inactive" />
            <el-option label="已废弃" value="deprecated" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleConfirmStatusUpdate"
            :loading="statusUpdating"
          >
            确认更新
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Upload, Search, Refresh, Clock } from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";
import {
  getSubAppDetail,
  getSubAppVersions,
  getSubAppVersionDetail,
  rollbackToVersion,
  deleteSubAppVersion,
  updateVersionStatus,
  type SubAppInfo,
  type SubAppVersion,
  type VersionQueryParams,
} from "../api/subApp";

// ==================== 响应式数据 ====================
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const detailLoading = ref(false);
const statusUpdating = ref(false);

const subAppInfo = ref<SubAppInfo | null>(null);
const versionList = ref<SubAppVersion[]>([]);

// 搜索表单
const searchForm = reactive<VersionQueryParams>({
  version: "",
  status: "",
  isCurrentVersion: undefined,
});

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// 详情对话框
const detailVisible = ref(false);
const currentVersion = ref<SubAppVersion | null>(null);

// 状态更新对话框
const statusDialogVisible = ref(false);
const statusForm = reactive({
  status: "active" as "active" | "inactive" | "deprecated",
});

// ==================== 方法定义 ====================

/**
 * 加载子应用信息
 */
const loadSubAppInfo = async () => {
  const subAppId = route.params.subAppId as string;
  if (!subAppId) {
    ElMessage.error("缺少子应用ID");
    router.push("/sub-app-management");
    return;
  }

  try {
    const response = await getSubAppDetail(subAppId);
    if (response.code === 200) {
      subAppInfo.value = response.data;
    } else {
      ElMessage.error(response.message || "获取子应用信息失败");
      router.push("/sub-app-management");
    }
  } catch (error) {
    console.error("获取子应用信息失败:", error);
    ElMessage.error("获取子应用信息失败");
    router.push("/sub-app-management");
  }
};

/**
 * 加载版本列表
 */
const loadVersionList = async () => {
  const subAppId = route.params.subAppId as string;
  if (!subAppId) return;

  loading.value = true;
  try {
    const params: VersionQueryParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm,
    };

    const response = await getSubAppVersions(subAppId, params);
    if (response.code === 200) {
      versionList.value = response.data.list;
      pagination.total = response.data.total;
    } else {
      ElMessage.error(response.message || "获取版本列表失败");
    }
  } catch (error) {
    console.error("获取版本列表失败:", error);
    ElMessage.error("获取版本列表失败");
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1;
  loadVersionList();
};

/**
 * 处理重置
 */
const handleReset = () => {
  searchForm.version = "";
  searchForm.status = "";
  searchForm.isCurrentVersion = undefined;
  pagination.page = 1;
  loadVersionList();
};

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadVersionList();
};

/**
 * 处理当前页变化
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadVersionList();
};

/**
 * 查看版本详情
 */
const handleViewVersionDetail = async (row: SubAppVersion) => {
  const subAppId = route.params.subAppId as string;
  detailVisible.value = true;
  detailLoading.value = true;
  currentVersion.value = null;

  try {
    const response = await getSubAppVersionDetail(subAppId, row.id.toString());
    if (response.code === 200) {
      currentVersion.value = response.data;
    } else {
      ElMessage.error(response.message || "获取版本详情失败");
      detailVisible.value = false;
    }
  } catch (error) {
    console.error("获取版本详情失败:", error);
    ElMessage.error("获取版本详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

/**
 * 回滚到指定版本
 */
const handleRollback = async (row: SubAppVersion) => {
  try {
    await ElMessageBox.confirm(
      `确定要回滚到版本 "${row.version}" 吗？此操作将替换当前版本。`,
      "确认回滚",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const subAppId = route.params.subAppId as string;
    const response = await rollbackToVersion(subAppId, row.id.toString());
    if (response.code === 200) {
      ElMessage.success("回滚成功");
      loadVersionList(); // 刷新列表
    } else {
      ElMessage.error(response.message || "回滚失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("回滚失败:", error);
      ElMessage.error("回滚失败");
    }
  }
};

/**
 * 更新版本状态
 */
const handleUpdateStatus = (row: SubAppVersion) => {
  currentVersion.value = row;
  statusForm.status = row.status;
  statusDialogVisible.value = true;
};

/**
 * 确认更新状态
 */
const handleConfirmStatusUpdate = async () => {
  if (!currentVersion.value) return;

  statusUpdating.value = true;
  try {
    const subAppId = route.params.subAppId as string;
    const response = await updateVersionStatus(
      subAppId,
      currentVersion.value.id.toString(),
      statusForm.status
    );
    if (response.code === 200) {
      ElMessage.success("状态更新成功");
      statusDialogVisible.value = false;
      loadVersionList(); // 刷新列表
    } else {
      ElMessage.error(response.message || "状态更新失败");
    }
  } catch (error) {
    console.error("状态更新失败:", error);
    ElMessage.error("状态更新失败");
  } finally {
    statusUpdating.value = false;
  }
};

/**
 * 删除版本
 */
const handleDeleteVersion = async (row: SubAppVersion) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除版本 "${row.version}" 吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const subAppId = route.params.subAppId as string;
    const response = await deleteSubAppVersion(subAppId, row.id.toString());
    if (response.code === 200) {
      ElMessage.success("删除成功");
      loadVersionList(); // 刷新列表
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
 * 上传新版本
 */
const handleUploadNewVersion = () => {
  ElMessage.info("上传新版本功能开发中...");
  // TODO: 实现上传新版本功能
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
 * 获取版本状态类型
 */
const getVersionStatusType = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "success",
    inactive: "info",
    deprecated: "danger",
  };
  return statusMap[status] || "info";
};

/**
 * 获取版本状态文本
 */
const getVersionStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "活跃",
    inactive: "非活跃",
    deprecated: "已废弃",
  };
  return statusMap[status] || "未知";
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadSubAppInfo();
  loadVersionList();
});
</script>

<style scoped>
@import "../styles/common.scss";

.version-history-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-number {
  font-weight: 600;
  color: #409eff;
}

/* 版本详情对话框样式 */
.version-detail-content {
  min-height: 400px;
}

.release-notes-section,
.config-section {
  margin-top: 20px;
}

.release-notes-section h4,
.config-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.release-notes-card,
.config-card {
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
}

.release-notes-card pre,
.config-card pre {
  margin: 0;
  padding: 12px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  background: transparent;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.detail-actions {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.detail-actions .el-button {
  margin: 0 8px;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
