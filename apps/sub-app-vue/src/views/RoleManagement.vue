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
        <el-table-column prop="menus" label="菜单权限" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.menus && row.menus.length > 0" type="success">
              {{ row.menus.length }} 个菜单
            </el-tag>
            <el-tag v-else type="info">无权限</el-tag>
          </template>
        </el-table-column>
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
            <TableActionButtons :max-visible="1">
              <el-button size="small" type="info" link @click="handleView(row)">
                查看
              </el-button>
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

    <!-- 角色编辑对话框 -->
    <RoleEditDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :role-data="currentRole"
      :menu-list="menuList"
      @submit="handleRoleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Refresh } from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";
import RoleEditDialog from "../components/RoleEditDialog.vue";
import {
  roleApi,
  type Role,
  type CreateRoleDto,
  type UpdateRoleDto,
  type Menu,
} from "../api/role";

// ==================== 响应式数据 ====================
const loading = ref(false);
const roleList = ref<Role[]>([]);
const menuList = ref<Menu[]>([]);
const searchQuery = reactive({
  name: "",
});
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view">("create");
const currentRole = ref<Role | undefined>(undefined);

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

// 角色表单数据已移至 RoleEditDialog 组件中

// ==================== 生命周期 ====================
onMounted(() => {
  loadRoleList();
  loadMenuList();
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
 * 加载菜单列表
 */
const loadMenuList = async () => {
  try {
    const response = await roleApi.getRoleMenu();
    if (response.code === 200) {
      menuList.value = response.data || [];
    }
  } catch (error: any) {
    console.error("加载菜单列表失败:", error);
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
  currentRole.value = undefined;
  dialogVisible.value = true;
};

/**
 * 处理查看角色
 */
const handleView = (role: Role) => {
  dialogMode.value = "view";
  currentRole.value = role;
  dialogVisible.value = true;
};

/**
 * 处理编辑角色
 */
const handleEdit = (role: Role) => {
  dialogMode.value = "edit";
  currentRole.value = role;
  dialogVisible.value = true;
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
 * 处理角色表单提交
 */
const handleRoleSubmit = async (formData: CreateRoleDto | UpdateRoleDto) => {
  try {
    if (dialogMode.value === "create") {
      await roleApi.createRole(formData as CreateRoleDto);
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      const updateData = formData as UpdateRoleDto;
      await roleApi.updateRole(currentRole.value!.id, updateData);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadRoleList();
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "操作失败"
    );
  }
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
