<template>
  <div class="list-page">
    <div class="page-header">
      <h1>角色管理</h1>
      <p>管理系统角色信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery.name"
          placeholder="搜索角色名称"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 角色表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="roleList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="role" label="角色标识" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="small" type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="roleForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>

        <el-form-item label="角色标识" prop="role">
          <el-input
            v-model="roleForm.role"
            placeholder="请输入角色标识"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="roleForm.status"
            :disabled="dialogMode === 'view'"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
            v-if="dialogMode !== 'view'"
          >
            {{ dialogMode === "create" ? "创建" : "更新" }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { Search, Plus, Refresh } from "@element-plus/icons-vue";
import {
  roleApi,
  type Role,
  type CreateRoleDto,
  type UpdateRoleDto,
} from "../api/role";

// ==================== 响应式数据 ====================
const loading = ref(false);
const submitLoading = ref(false);
const roleList = ref<Role[]>([]);
const searchQuery = reactive({
  name: "",
});
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view">("create");
const formRef = ref<FormInstance>();

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

const roleForm = reactive<CreateRoleDto & { id?: number }>({
  name: "",
  role: "",
  status: true,
  remark: "",
});

// ==================== 计算属性 ====================
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "create":
      return "新增角色";
    case "edit":
      return "编辑角色";
    case "view":
      return "查看角色";
    default:
      return "角色信息";
  }
});

// ==================== 表单验证规则 ====================
const formRules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "角色名称长度在 2 到 50 个字符",
      trigger: "blur",
    },
  ],
  role: [
    { max: 50, message: "角色标识长度不能超过 50 个字符", trigger: "blur" },
  ],
  remark: [
    { max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" },
  ],
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadRoleList();
});

// ==================== 方法定义 ====================

/**
 * 加载角色列表
 */
const loadRoleList = async () => {
  try {
    loading.value = true;
    const response = await roleApi.getRoles({
      page: pagination.page,
      limit: pagination.limit,
      name: searchQuery.name || undefined,
    });

    if (response.code === 200) {
      roleList.value = response.data.list || [];
      pagination.total = response.data.total || 0;
    }
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "加载角色列表失败"
    );
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1;
  loadRoleList();
};

/**
 * 刷新数据
 */
const refreshData = () => {
  loadRoleList();
};

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadRoleList();
};

/**
 * 处理页码变化
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadRoleList();
};

/**
 * 处理新增角色
 */
const handleCreate = () => {
  dialogMode.value = "create";
  dialogVisible.value = true;
  resetForm();
};

/**
 * 处理查看角色
 */
const handleView = (role: Role) => {
  dialogMode.value = "view";
  dialogVisible.value = true;
  Object.assign(roleForm, {
    ...role,
  });
};

/**
 * 处理编辑角色
 */
const handleEdit = (role: Role) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  Object.assign(roleForm, {
    ...role,
  });
};

/**
 * 处理删除角色
 */
const handleDelete = async (role: Role) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${role.name}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await roleApi.deleteRole(role.id);
    ElMessage.success("删除成功");
    loadRoleList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(
        error.response?.data?.message || error.message || "删除失败"
      );
    }
  }
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (dialogMode.value === "create") {
      await roleApi.createRole(roleForm as CreateRoleDto);
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      const { ...updateData } = roleForm;
      await roleApi.updateRole(roleForm.id!, updateData as UpdateRoleDto);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadRoleList();
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "操作失败"
    );
  } finally {
    submitLoading.value = false;
  }
};

/**
 * 重置表单
 */
const resetForm = () => {
  Object.assign(roleForm, {
    name: "",
    role: "",
    status: true,
    remark: "",
  });
  formRef.value?.clearValidate();
};

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-CN");
};
</script>

<style scoped>
@import "../styles/common.scss";
</style>
