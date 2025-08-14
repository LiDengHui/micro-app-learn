<template>
  <div class="list-page">
    <div class="page-header">
      <h1>菜单管理</h1>
      <p>管理系统菜单和权限配置</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery.name"
          placeholder="搜索菜单名称"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
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
          新增菜单
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 菜单表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="menuList"
        style="width: 100%"
        border
        stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="菜单名称" width="200">
          <template #default="{ row }">
            <span>{{ row.title || row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meta.icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.meta?.icon">
              <component :is="row.meta.icon" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="组件" width="150">
          <template #default="{ row }">
            <span v-if="row.component === '#'">顶级目录</span>
            <span v-else-if="row.component === '##'">子目录</span>
            <span v-else>{{ row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeTag(row.type)">
              {{ getMenuTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-column">
              <TableActionButtons :max-visible="1">
                <el-button
                  size="small"
                  type="info"
                  link
                  @click="handleView(row)"
                >
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
            </div>
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

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="menuForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单标识" prop="name">
              <el-input v-model="menuForm.name" placeholder="请输入菜单标识" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单路径" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入菜单路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input
                v-model="menuForm.component"
                placeholder="请输入组件路径"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="type">
              <el-select v-model="menuForm.type" placeholder="请选择菜单类型">
                <el-option label="目录" :value="0" />
                <el-option label="菜单" :value="1" />
                <el-option label="按钮" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级菜单" prop="parentId">
              <el-tree-select
                v-model="menuForm.parentId"
                :data="menuTreeData"
                :props="{ label: 'title', value: 'id', children: 'children' }"
                placeholder="请选择父级菜单"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="menuForm.status"
                :active-value="true"
                :inactive-value="false"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="meta.icon">
              <el-input
                v-model="menuForm.meta.icon"
                placeholder="请输入图标名称"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 菜单元数据配置 -->
        <el-divider content-position="left">菜单元数据</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="固定标签">
              <el-switch v-model="menuForm.meta.affix" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总是显示">
              <el-switch v-model="menuForm.meta.alwaysShow" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="面包屑">
              <el-switch v-model="menuForm.meta.breadcrumb" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="可跳转">
              <el-switch v-model="menuForm.meta.canTo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="隐藏菜单">
              <el-switch v-model="menuForm.meta.hidden" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不缓存">
              <el-switch v-model="menuForm.meta.noCache" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="不显示标签">
              <el-switch v-model="menuForm.meta.noTagsView" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 权限配置 -->
        <el-divider content-position="left">权限配置</el-divider>
        <div class="permissions-container">
          <div
            v-for="(permission, index) in menuForm.permissions"
            :key="index"
            class="permission-item"
          >
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="`权限${index + 1}标签`">
                  <el-input
                    v-model="permission.label"
                    placeholder="请输入权限标签"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权限值">
                  <el-input
                    v-model="permission.value"
                    placeholder="请输入权限值"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  size="small"
                  @click="removePermission(index)"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </div>
          <el-button type="primary" size="small" @click="addPermission">
            添加权限
          </el-button>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          v-if="dialogMode !== 'view'"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Refresh } from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";
import { menuApi, type Menu, type CreateMenuDto } from "../api/menu";

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view">("create");
const formRef = ref();

const menuList = ref<Menu[]>([]);
const menuTreeData = ref<Menu[]>([]);

// 搜索参数
const searchQuery = reactive({
  name: "",
  status: null as boolean | null,
});

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

// 菜单表单
const menuForm = reactive<CreateMenuDto>({
  name: "",
  title: "",
  path: "",
  component: "",
  type: 0,
  parentId: null,
  status: true,
  meta: {
    icon: "",
    affix: false,
    alwaysShow: false,
    breadcrumb: true,
    canTo: true,
    hidden: false,
    noCache: false,
    noTagsView: false,
  },
  permissions: [],
});

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: "请输入菜单标识", trigger: "blur" },
    { max: 50, message: "菜单标识不能超过50个字符", trigger: "blur" },
  ],
  title: [
    { required: true, message: "请输入菜单名称", trigger: "blur" },
    { max: 50, message: "菜单名称不能超过50个字符", trigger: "blur" },
  ],
  path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
};

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "create":
      return "新增菜单";
    case "edit":
      return "编辑菜单";
    case "view":
      return "查看菜单";
    default:
      return "菜单管理";
  }
});

// 生命周期
onMounted(() => {
  loadMenuList();
});

// 方法
/**
 * 加载菜单列表
 */
const loadMenuList = async () => {
  try {
    loading.value = true;
    const response = await menuApi.getMenus({
      ...searchQuery,
      page: pagination.page,
      limit: pagination.limit,
    });
    if (response.data) {
      menuList.value = response.data.list || [];
      pagination.total = response.data.total || 0;
      // 构建树形数据用于父级菜单选择
      menuTreeData.value = buildMenuTree(response.data.list || []);
    }
  } catch (error: any) {
    console.error(
      "加载菜单列表失败:",
      error.response?.data?.message || error.message
    );
    ElMessage.error("加载菜单列表失败");
  } finally {
    loading.value = false;
  }
};

/**
 * 构建菜单树形数据
 */
const buildMenuTree = (menus: Menu[]): Menu[] => {
  const menuMap = new Map<number, Menu>();
  const roots: Menu[] = [];

  // 创建映射
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 构建树形结构
  menus.forEach((menu) => {
    const node = menuMap.get(menu.id)!;
    if (menu.parentId && menuMap.has(menu.parentId)) {
      const parent = menuMap.get(menu.parentId)!;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

/**
 * 获取菜单类型标签
 */
const getMenuTypeTag = (type: number) => {
  switch (type) {
    case 0:
      return "primary";
    case 1:
      return "success";
    case 2:
      return "warning";
    default:
      return "info";
  }
};

/**
 * 获取菜单类型文本
 */
const getMenuTypeText = (type: number) => {
  switch (type) {
    case 0:
      return "目录";
    case 1:
      return "菜单";
    case 2:
      return "按钮";
    default:
      return "未知";
  }
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1;
  loadMenuList();
};

/**
 * 刷新数据
 */
const refreshData = () => {
  loadMenuList();
};

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadMenuList();
};

/**
 * 处理页码变化
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadMenuList();
};

/**
 * 处理新增菜单
 */
const handleCreate = () => {
  dialogMode.value = "create";
  dialogVisible.value = true;
  resetForm();
};

/**
 * 处理查看菜单
 */
const handleView = (menu: Menu) => {
  dialogMode.value = "view";
  dialogVisible.value = true;
  Object.assign(menuForm, {
    ...menu,
    meta: menu.meta || {
      icon: "",
      affix: false,
      alwaysShow: false,
      breadcrumb: true,
      canTo: true,
      hidden: false,
      noCache: false,
      noTagsView: false,
    },
    permissions: menu.permissions || [],
  });
};

/**
 * 处理编辑菜单
 */
const handleEdit = (menu: Menu) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  Object.assign(menuForm, {
    ...menu,
    meta: menu.meta || {
      icon: "",
      affix: false,
      alwaysShow: false,
      breadcrumb: true,
      canTo: true,
      hidden: false,
      noCache: false,
      noTagsView: false,
    },
    permissions: menu.permissions || [],
  });
};

/**
 * 处理删除菜单
 */
const handleDelete = async (menu: Menu) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${menu.title || menu.name}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await menuApi.deleteMenu(menu.id);
    ElMessage.success("删除成功");
    loadMenuList();
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
      await menuApi.createMenu(menuForm);
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      // 确保编辑模式下有 id 字段
      const updateData = { ...menuForm, id: (menuForm as any).id };
      await menuApi.updateMenu(updateData);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadMenuList();
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "操作失败"
    );
  } finally {
    submitLoading.value = false;
  }
};

/**
 * 添加权限
 */
const addPermission = () => {
  menuForm.permissions.push({
    label: "",
    value: "",
  });
};

/**
 * 删除权限
 */
const removePermission = (index: number) => {
  menuForm.permissions.splice(index, 1);
};

/**
 * 重置表单
 */
const resetForm = () => {
  Object.assign(menuForm, {
    name: "",
    title: "",
    path: "",
    component: "",
    type: 0,
    parentId: null,
    status: true,
    meta: {
      icon: "",
      affix: false,
      alwaysShow: false,
      breadcrumb: true,
      canTo: true,
      hidden: false,
      noCache: false,
      noTagsView: false,
    },
    permissions: [],
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

.permissions-container {
  margin-top: 10px;
}

.permission-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.action-column {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
