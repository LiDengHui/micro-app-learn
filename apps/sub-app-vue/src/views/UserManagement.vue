<template>
  <div class="user-management">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统用户信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、昵称或邮箱"
          style="width: 300px"
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
          新增用户
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button>
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            :disabled="dialogMode === 'edit'"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogMode === 'create'"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
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
  userApi,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from "../api/user";

// ==================== 响应式数据 ====================
const loading = ref(false);
const submitLoading = ref(false);
const userList = ref<User[]>([]);
const searchQuery = ref("");
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view">("create");
const formRef = ref<FormInstance>();

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

const userForm = reactive<CreateUserDto & { id?: number; status?: number }>({
  username: "",
  password: "",
  nickname: "",
  email: "",
  phone: "",
  status: 1,
});

// ==================== 计算属性 ====================
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "create":
      return "新增用户";
    case "edit":
      return "编辑用户";
    case "view":
      return "查看用户";
    default:
      return "用户信息";
  }
});

// ==================== 表单验证规则 ====================
const formRules = {
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
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
  nickname: [
    { max: 50, message: "昵称长度不能超过 50 个字符", trigger: "blur" },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号格式",
      trigger: "blur",
    },
  ],
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadUserList();
});

// ==================== 方法定义 ====================

/**
 * 加载用户列表
 */
const loadUserList = async () => {
  try {
    loading.value = true;
    const response = await userApi.getUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: searchQuery.value || undefined,
    });

    if (response.data) {
      userList.value = response.data.data;
      pagination.total = response.data.meta.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "加载用户列表失败");
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1;
  loadUserList();
};

/**
 * 刷新数据
 */
const refreshData = () => {
  loadUserList();
};

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadUserList();
};

/**
 * 处理页码变化
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadUserList();
};

/**
 * 处理新增用户
 */
const handleCreate = () => {
  dialogMode.value = "create";
  dialogVisible.value = true;
  resetForm();
};

/**
 * 处理查看用户
 */
const handleView = (user: User) => {
  dialogMode.value = "view";
  dialogVisible.value = true;
  Object.assign(userForm, user);
};

/**
 * 处理编辑用户
 */
const handleEdit = (user: User) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  Object.assign(userForm, user);
};

/**
 * 处理删除用户
 */
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await userApi.deleteUser(user.id);
    ElMessage.success("删除成功");
    loadUserList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

/**
 * 处理切换用户状态
 */
const handleToggleStatus = async (user: User) => {
  try {
    const newStatus = user.status === 1 ? 0 : 1;
    await userApi.updateUser(user.id, { status: newStatus });
    ElMessage.success(`${newStatus === 1 ? "启用" : "禁用"}成功`);
    loadUserList();
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
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
      await userApi.createUser(userForm as CreateUserDto);
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      const { username, password, ...updateData } = userForm;
      await userApi.updateUser(userForm.id!, updateData as UpdateUserDto);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadUserList();
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

/**
 * 重置表单
 */
const resetForm = () => {
  Object.assign(userForm, {
    username: "",
    password: "",
    nickname: "",
    email: "",
    phone: "",
    status: 1,
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
.user-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-box {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
