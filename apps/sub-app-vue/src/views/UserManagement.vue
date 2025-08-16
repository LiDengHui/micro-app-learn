<template>
  <div class="list-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统用户信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery.username"
          placeholder="搜索用户名"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="searchQuery.account"
          placeholder="搜索账号"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><UserIcon /></el-icon>
          </template>
        </el-input>
        <el-tree-select
          v-model="searchQuery.departmentId"
          :data="departmentTreeData"
          placeholder="选择部门"
          style="width: 200px; margin-right: 10px"
          clearable
          filterable
          check-strictly
          :props="{
            children: 'children',
            label: 'name',
            value: 'id',
          }"
          @change="handleSearch"
        />
        <el-select
          v-model="searchQuery.roleId"
          placeholder="选择角色"
          style="width: 150px; margin-right: 10px"
          clearable
          filterable
          @change="handleSearch"
        >
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
        <el-select
          v-model="searchQuery.status"
          placeholder="选择状态"
          style="width: 120px; margin-right: 10px"
          clearable
          @change="handleSearch"
        >
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedRows.length === 0"
          :loading="deleteLoading"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="mobile" label="手机号" width="140" />
        <el-table-column prop="sex" label="性别" width="80">
          <template #default="{ row }">
            <el-tag
              :type="
                row.sex === 1 ? 'primary' : row.sex === 2 ? 'success' : 'info'
              "
            >
              {{ row.sex === 1 ? "男" : row.sex === 2 ? "女" : "未知" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="120">
          <template #default="{ row }">
            {{ row.department?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            {{ row.role?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP" width="140">
          <template #default="{ row }">
            {{ row.login_ip || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="login_date" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.login_date ? formatDate(row.login_date) : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <TableActionButtons :max-visible="1">
              <el-button
                size="small"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="success"
                link
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                size="small"
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </TableActionButtons>
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
      width="700px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="userForm.username"
                :disabled="dialogMode === 'edit'"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="userForm.account" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="userForm.sex" placeholder="请选择性别">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-tree-select
                v-model="userForm.departmentId"
                :data="departmentTreeData"
                placeholder="请选择部门"
                clearable
                filterable
                check-strictly
                :props="{
                  children: 'children',
                  label: 'name',
                  value: 'id',
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select
                v-model="userForm.roleId"
                placeholder="请选择角色"
                filterable
                remote
                :remote-method="filterRoles"
                :loading="roleLoading"
                clearable
              >
                <el-option
                  v-for="role in filteredRoleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="userForm.status"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="userForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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
import {
  Search,
  Plus,
  Refresh,
  User as UserIcon,
  Delete,
} from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";
import {
  userApi,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from "../api/user";
import { departmentApi, type Department } from "../api/department";
import { roleApi, type Role } from "../api/role";

// ==================== 响应式数据 ====================
const loading = ref(false);
const submitLoading = ref(false);
const roleLoading = ref(false);
const userList = ref<User[]>([]);
const departmentTreeData = ref<Department[]>([]);
const roleList = ref<Role[]>([]);
const filteredRoleList = ref<Role[]>([]);
const searchQuery = reactive({
  username: "",
  account: "",
  departmentId: null as number | null,
  roleId: null as number | null,
  status: null as boolean | null,
});
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view">("create");
const formRef = ref<FormInstance>();

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

const userForm = reactive<
  CreateUserDto & {
    id?: number;
    sex?: number | null;
    roleId?: number | null;
    departmentId?: number | null;
    status?: boolean;
  }
>({
  username: "",
  password: "",
  account: "",
  email: "",
  nickname: "",
  mobile: "",
  sex: null,
  roleId: null,
  departmentId: null,
  status: true,
  remark: "",
});

const selectedRows = ref<User[]>([]);
const deleteLoading = ref(false);

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
      max: 50,
      message: "用户名长度在 2 到 50 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 100,
      message: "密码长度在 6 到 100 个字符",
      trigger: "blur",
    },
  ],
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { max: 100, message: "账号长度不能超过 100 个字符", trigger: "blur" },
  ],
  nickname: [
    { max: 30, message: "昵称长度不能超过 30 个字符", trigger: "blur" },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
  mobile: [
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
  loadDepartments();
  loadRoles();
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
      username: searchQuery.username || undefined,
      account: searchQuery.account || undefined,
      departmentId: searchQuery.departmentId || undefined,
      roleId: searchQuery.roleId || undefined,
      status: searchQuery.status !== null ? searchQuery.status : undefined,
    });

    // 修正: 使用正确的常量和数据结构
    if (response.code === 200) {
      userList.value = response.data.list || [];
      pagination.total = response.data.total || 0;
    }
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "加载用户列表失败"
    );
  } finally {
    loading.value = false;
  }
};

/**
 * 加载部门列表
 */
const loadDepartments = async () => {
  try {
    const response = await departmentApi.getAllDepartments();
    if (response.data?.list) {
      // 直接使用树形结构
      departmentTreeData.value = response.data.list;
    }
  } catch (error: any) {
    console.error(
      "加载部门列表失败:",
      error.response?.data?.message || error.message
    );
  }
};

/**
 * 加载角色列表
 */
const loadRoles = async () => {
  try {
    const response = await roleApi.getAllRoles();
    if (response.data?.list) {
      roleList.value = response.data.list;
      filteredRoleList.value = response.data.list;
    }
  } catch (error: any) {
    console.error(
      "加载角色列表失败:",
      error.response?.data?.message || error.message
    );
  }
};

/**
 * 过滤角色列表
 */
const filterRoles = async (query: string) => {
  if (query !== "") {
    roleLoading.value = true;
    try {
      // 调用后端搜索接口
      const response = await roleApi.getRoles({
        page: 1,
        limit: 1000,
        name: query,
      });
      if (response.data?.list) {
        filteredRoleList.value = response.data.list;
      }
    } catch (error: any) {
      console.error(
        "搜索角色失败:",
        error.response?.data?.message || error.message
      );
      ElMessage.error("搜索角色失败");
      // 如果搜索失败，回退到本地过滤
      filteredRoleList.value = roleList.value.filter((role) =>
        role.name.toLowerCase().includes(query.toLowerCase())
      );
    } finally {
      roleLoading.value = false;
    }
  } else {
    // 如果搜索词为空，显示所有角色
    filteredRoleList.value = roleList.value;
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
 * 处理表格选择变化
 */
const handleSelectionChange = (selection: User[]) => {
  selectedRows.value = selection;
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
  // 只复制需要的字段
  Object.assign(userForm, {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    mobile: user.mobile,
    sex: user.sex || null,
    roleId: user.roleId || null,
    departmentId: user.departmentId || null,
    status: user.status,
    remark: user.remark,
    password: "", // 查看时不显示密码
    account: "", // 后端返回的用户数据中没有 account 字段
  });
};

/**
 * 处理编辑用户
 */
const handleEdit = (user: User) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  // 只复制需要的字段
  Object.assign(userForm, {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    mobile: user.mobile,
    sex: user.sex || null,
    roleId: user.roleId || null,
    departmentId: user.departmentId || null,
    status: user.status,
    remark: user.remark,
    password: "", // 编辑时密码为空，用户可以选择是否修改
    account: "", // 后端返回的用户数据中没有 account 字段
  });
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

    deleteLoading.value = true;
    await userApi.deleteUser(user.id);
    ElMessage.success("删除成功");
    loadUserList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(
        error.response?.data?.message || error.message || "删除失败"
      );
    }
  } finally {
    deleteLoading.value = false;
  }
};

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  try {
    const userNames = selectedRows.value
      .map((user) => user.username)
      .join("、");
    await ElMessageBox.confirm(
      `确定要删除以下用户吗？\n${userNames}`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    deleteLoading.value = true;
    const deletePromises = selectedRows.value.map((user) =>
      userApi.deleteUser(user.id)
    );
    await Promise.all(deletePromises);
    ElMessage.success("批量删除成功");
    selectedRows.value = [];
    loadUserList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(
        error.response?.data?.message || error.message || "批量删除失败"
      );
    }
  } finally {
    deleteLoading.value = false;
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
      // 创建用户时，只传递需要的字段
      const createData: CreateUserDto = {
        username: userForm.username,
        password: userForm.password,
        account: userForm.account,
        email: userForm.email,
        nickname: userForm.nickname,
        mobile: userForm.mobile,
        sex: userForm.sex,
        roleId: userForm.roleId,
        departmentId: userForm.departmentId,
        status: userForm.status,
        remark: userForm.remark,
      };
      await userApi.createUser(createData);
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      // 更新用户时，只传递需要的字段
      const updateData: UpdateUserDto = {
        username: userForm.username,
        account: userForm.account,
        email: userForm.email,
        nickname: userForm.nickname,
        mobile: userForm.mobile,
        sex: userForm.sex,
        roleId: userForm.roleId,
        departmentId: userForm.departmentId,
        status: userForm.status,
        remark: userForm.remark,
      };
      // 如果密码不为空，则包含密码
      if (userForm.password) {
        updateData.password = userForm.password;
      }
      await userApi.updateUser(userForm.id!, updateData);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadUserList();
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
  Object.assign(userForm, {
    username: "",
    password: "",
    account: "",
    email: "",
    nickname: "",
    mobile: "",
    sex: null,
    roleId: null,
    departmentId: null,
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
