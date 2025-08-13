<template>
  <div class="sub-app-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">子应用管理</h2>
      <p class="page-description">管理微前端子应用的部署和配置</p>
    </div>

    <!-- 上传区域 -->
    <el-card class="upload-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Upload /></el-icon>
            上传子应用
          </span>
        </div>
      </template>

      <el-upload
        ref="uploadRef"
        class="upload-area"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".zip"
        :disabled="uploading"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 zip 文件，且不超过 100MB</div>
        </template>
      </el-upload>

      <div v-if="selectedFile" class="file-info">
        <el-alert
          :title="`已选择文件: ${selectedFile.name}`"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
            <el-button
              type="primary"
              @click="handleUpload"
              :loading="uploading"
            >
              {{ uploading ? "上传中..." : "开始上传" }}
            </el-button>
            <el-button @click="clearFile">取消</el-button>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="search-card" shadow="hover">
      <el-form :model="searchForm" inline>
        <el-form-item label="应用名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入应用名称"
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
            <el-option label="错误" value="error" />
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

    <!-- 子应用列表 -->
    <el-card class="list-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">子应用列表</span>
          <el-button type="primary" @click="loadSubAppList" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="subAppList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column prop="name" label="应用名称" min-width="160">
          <template #default="{ row }">
            <div class="app-name">
              <el-icon class="app-icon"><Box /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="version" label="版本号" width="100" />

        <el-table-column
          prop="description"
          label="描述"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column prop="fileSize" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="上传时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <TableActionButtons :max-visible="1">
              <el-button
                type="primary"
                size="small"
                @click="handleViewDetail(row)"
              >
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 'active'"
                type="warning"
                size="small"
                @click="handleToggleStatus(row, 'inactive')"
              >
                停用
              </el-button>
              <el-button
                v-else
                type="success"
                size="small"
                @click="handleToggleStatus(row, 'active')"
              >
                启用
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, type UploadFile } from "element-plus";
import {
  Upload,
  UploadFilled,
  Search,
  Refresh,
  Box,
} from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";
import {
  getSubAppList,
  uploadSubApp,
  deleteSubApp,
  updateSubAppStatus,
  type SubAppInfo,
  type QueryParams,
} from "../api/subApp";

// ==================== 响应式数据 ====================
const router = useRouter();
const loading = ref(false);
const uploading = ref(false);
const selectedFile = ref<File | null>(null);
const subAppList = ref<SubAppInfo[]>([]);

// 搜索表单
const searchForm = reactive<QueryParams>({
  name: "",
  status: "",
});

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// ==================== 方法定义 ====================

/**
 * 加载子应用列表
 */
const loadSubAppList = async () => {
  loading.value = true;
  try {
    const params: QueryParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm,
    };

    const response = await getSubAppList(params);
    if (response.code === 200) {
      subAppList.value = response.data.items;
      pagination.total = response.data.total;
    } else {
      ElMessage.error(response.message || "获取子应用列表失败");
    }
  } catch (error) {
    console.error("加载子应用列表失败:", error);
    ElMessage.error("获取子应用列表失败");
  } finally {
    loading.value = false;
  }
};

/**
 * 处理文件选择
 */
const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    selectedFile.value = file.raw;
  }
};

/**
 * 处理文件上传
 */
const handleUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请先选择文件");
    return;
  }

  uploading.value = true;
  try {
    const response = await uploadSubApp(selectedFile.value);
    if (response.code === 200) {
      ElMessage.success("上传成功");
      clearFile();
      loadSubAppList(); // 刷新列表
    } else {
      ElMessage.error(response.message || "上传失败");
    }
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("上传失败");
  } finally {
    uploading.value = false;
  }
};

/**
 * 清除选择的文件
 */
const clearFile = () => {
  selectedFile.value = null;
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1;
  loadSubAppList();
};

/**
 * 处理重置
 */
const handleReset = () => {
  searchForm.name = "";
  searchForm.status = "";
  pagination.page = 1;
  loadSubAppList();
};

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadSubAppList();
};

/**
 * 处理当前页变化
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadSubAppList();
};

/**
 * 处理状态切换
 */
const handleToggleStatus = async (
  row: SubAppInfo,
  status: "active" | "inactive"
) => {
  try {
    const response = await updateSubAppStatus(row.id.toString(), status);
    if (response.code === 200) {
      ElMessage.success(`${status === "active" ? "启用" : "停用"}成功`);
      loadSubAppList(); // 刷新列表
    } else {
      ElMessage.error(response.message || "操作失败");
    }
  } catch (error) {
    console.error("状态切换失败:", error);
    ElMessage.error("操作失败");
  }
};

/**
 * 处理删除
 */
const handleDelete = async (row: SubAppInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除子应用 "${row.name}" 吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const response = await deleteSubApp(row.id.toString());
    if (response.code === 200) {
      ElMessage.success("删除成功");
      loadSubAppList(); // 刷新列表
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
 * 查看详情
 */
const handleViewDetail = (row: SubAppInfo) => {
  router.push(`/sub-app-detail/${row.id}`);
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
  loadSubAppList();
});
</script>

<style scoped>
.sub-app-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-description {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.upload-card,
.search-card,
.list-card {
  margin-bottom: 20px;
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

.upload-area {
  width: 100%;
}

.file-info {
  margin-top: 16px;
}

.app-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-icon {
  color: #409eff;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 120px;
}

:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>
