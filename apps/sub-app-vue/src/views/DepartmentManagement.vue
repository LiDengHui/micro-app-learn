<template>
  <div class="list-page">
    <div class="page-header">
      <h1>部门管理</h1>
      <p>管理系统部门信息（树形结构）</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery.name"
          placeholder="搜索部门名称"
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
          新增部门
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 部门树形表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="departmentList"
        style="width: 100%"
        border
        stripe
        row-key="id"
        :tree-props="{ children: 'children' }"
        default-expand-all
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="部门名称" min-width="200" />
        <el-table-column prop="parentId" label="上级部门" width="150">
          <template #default="{ row }">
            {{ getParentName(row.parentId) }}
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="负责人" width="120">
          <template #default="{ row }">
            {{ row.leader?.username || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="200" />
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
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="small" type="success" @click="handleAddChild(row)"
              >添加子部门</el-button
            >
            <el-button size="small" type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 部门表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="departmentForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="departmentForm.name"
                placeholder="请输入部门名称"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                v-model="departmentForm.parentId"
                :data="departmentTreeData"
                :props="{ label: 'name', value: 'id', children: 'children' }"
                placeholder="请选择上级部门"
                :disabled="dialogMode === 'view'"
                clearable
                check-strictly
                :render-after-expand="false"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader_user_id">
              <el-select
                v-model="departmentForm.leader_user_id"
                placeholder="请选择负责人"
                :disabled="dialogMode === 'view'"
                clearable
              >
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="user.username"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="departmentForm.phone"
                placeholder="请输入联系电话"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="departmentForm.email"
                placeholder="请输入邮箱"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="departmentForm.status"
                :disabled="dialogMode === 'view'"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  departmentApi,
  type Department,
  type CreateDepartmentDto,
  type UpdateDepartmentDto,
} from "../api/department";
import { userApi, type User } from "../api/user";

// ==================== 响应式数据 ====================
const loading = ref(false);
const submitLoading = ref(false);
const departmentList = ref<Department[]>([]);
const departmentTreeData = ref<Department[]>([]);
const userList = ref<User[]>([]);
const searchQuery = reactive({
  name: "",
});
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit" | "view" | "addChild">("create");
const formRef = ref<FormInstance>();

const departmentForm = reactive<CreateDepartmentDto & { id?: number }>({
  name: "",
  parentId: undefined,
  leader_user_id: undefined,
  phone: "",
  email: "",
  status: true,
});

// ==================== 计算属性 ====================
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "create":
      return "新增部门";
    case "edit":
      return "编辑部门";
    case "view":
      return "查看部门";
    case "addChild":
      return "添加子部门";
    default:
      return "部门信息";
  }
});

// ==================== 表单验证规则 ====================
const formRules = {
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "部门名称长度在 2 到 50 个字符",
      trigger: "blur",
    },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号格式",
      trigger: "blur",
    },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadDepartmentList();
  loadUsers();

  // 测试树形数据
  setTimeout(() => {
    console.log("当前部门列表数据:", departmentList.value);
    if (departmentList.value.length > 0) {
      console.log("第一个部门的children:", departmentList.value[0].children);
    }

    // 如果没有数据，添加测试数据
    if (departmentList.value.length === 0) {
      console.log("添加测试数据");
      departmentList.value = [
        {
          id: 1,
          name: "总公司",
          parentId: undefined,
          status: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: [
            {
              id: 2,
              name: "技术部",
              parentId: 1,
              status: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [],
            },
            {
              id: 3,
              name: "市场部",
              parentId: 1,
              status: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [],
            },
          ],
        },
      ];
    }
  }, 1000);
});

// ==================== 方法定义 ====================

/**
 * 加载部门列表
 */
const loadDepartmentList = async () => {
  try {
    loading.value = true;
    const response = await departmentApi.getDepartments({
      name: searchQuery.name || undefined,
    });

    if (response.code === 200) {
      const departments = response.data.list || [];
      console.log("原始部门数据:", departments);
      // 后端已经返回树形结构，直接使用
      departmentList.value = departments;
      // 构建树形数据用于选择器（扁平化处理）
      departmentTreeData.value = buildTreeData(flattenDepartments(departments));
      console.log("处理后的树形数据:", departmentList.value);

      // 检查树形结构
      if (departments.length > 0) {
        console.log("第一个部门:", departments[0]);
        console.log("第一个部门的children:", departments[0].children);
      }
    }
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "加载部门列表失败"
    );
  } finally {
    loading.value = false;
  }
};

/**
 * 加载用户列表
 */
const loadUsers = async () => {
  try {
    const response = await userApi.getUsers({ limit: 1000 });
    if (response.code === 200) {
      userList.value = response.data.list || [];
    }
  } catch (error: any) {
    console.error(
      "加载用户列表失败:",
      error.response?.data?.message || error.message
    );
  }
};

/**
 * 扁平化树形数据
 */
const flattenDepartments = (departments: Department[]): Department[] => {
  const result: Department[] = [];

  const traverse = (depts: Department[]) => {
    depts.forEach((dept) => {
      result.push({ ...dept, children: undefined });
      if (dept.children && dept.children.length > 0) {
        traverse(dept.children);
      }
    });
  };

  traverse(departments);
  return result;
};

/**
 * 构建树形数据
 */
const buildTreeData = (departments: Department[]): Department[] => {
  const map = new Map<number, Department>();
  const roots: Department[] = [];

  // 创建映射
  departments.forEach((dept) => {
    map.set(dept.id, { ...dept, children: [] });
  });

  // 构建树形结构
  departments.forEach((dept) => {
    const node = map.get(dept.id)!;
    if (dept.parentId && map.has(dept.parentId)) {
      const parent = map.get(dept.parentId)!;
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
 * 获取父部门名称
 */
const getParentName = (parentId?: number): string => {
  if (!parentId) return "顶级部门";

  // 从原始部门数据中查找父部门名称
  const findParentInFlatList = (
    departments: Department[],
    id: number
  ): string => {
    const parent = departments.find((dept) => dept.id === id);
    return parent ? parent.name : "";
  };

  // 从树形数据中查找父部门名称
  const findParentInTree = (departments: Department[], id: number): string => {
    for (const dept of departments) {
      if (dept.id === id) return dept.name;
      if (dept.children && dept.children.length > 0) {
        const found = findParentInTree(dept.children, id);
        if (found) return found;
      }
    }
    return "";
  };

  // 先尝试从树形数据中查找，如果找不到再从原始数据中查找
  const result = findParentInTree(departmentList.value, parentId);
  return result || "-";
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  loadDepartmentList();
};

/**
 * 刷新数据
 */
const refreshData = () => {
  loadDepartmentList();
};

/**
 * 处理新增部门
 */
const handleCreate = () => {
  dialogMode.value = "create";
  dialogVisible.value = true;
  resetForm();
};

/**
 * 处理添加子部门
 */
const handleAddChild = (department: Department) => {
  dialogMode.value = "addChild";
  dialogVisible.value = true;
  resetForm();
  departmentForm.parentId = department.id;
};

/**
 * 处理查看部门
 */
const handleView = (department: Department) => {
  dialogMode.value = "view";
  dialogVisible.value = true;
  Object.assign(departmentForm, {
    ...department,
  });
};

/**
 * 处理编辑部门
 */
const handleEdit = (department: Department) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  Object.assign(departmentForm, {
    ...department,
  });
};

/**
 * 检查是否会造成循环引用
 */
const checkCircularReference = (
  parentId: number,
  currentId?: number
): boolean => {
  if (!currentId) return false;
  if (parentId === currentId) return true;

  const findParent = (departments: Department[], id: number): number | null => {
    for (const dept of departments) {
      if (dept.id === id) return dept.parentId || null;
      if (dept.children && dept.children.length > 0) {
        const found = findParent(dept.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  let currentParentId = findParent(departmentList.value, parentId);
  while (currentParentId) {
    if (currentParentId === currentId) return true;
    currentParentId = findParent(departmentList.value, currentParentId);
  }

  return false;
};

/**
 * 处理删除部门
 */
const handleDelete = async (department: Department) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除部门 "${department.name}" 吗？删除后将同时删除其下所有子部门！`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await departmentApi.deleteDepartment([department.id]);
    ElMessage.success("删除成功");
    loadDepartmentList();
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

    // 检查循环引用
    if (departmentForm.parentId && departmentForm.id) {
      if (checkCircularReference(departmentForm.parentId, departmentForm.id)) {
        ElMessage.error("不能将部门设置为自己的子部门，这会造成循环引用！");
        return;
      }
    }

    submitLoading.value = true;

    if (dialogMode.value === "create" || dialogMode.value === "addChild") {
      await departmentApi.createDepartment(
        departmentForm as CreateDepartmentDto
      );
      ElMessage.success("创建成功");
    } else if (dialogMode.value === "edit") {
      const updateData = { ...departmentForm };
      await departmentApi.updateDepartment(updateData as UpdateDepartmentDto);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    loadDepartmentList();
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
  Object.assign(departmentForm, {
    id: undefined,
    name: "",
    parentId: undefined,
    leader_user_id: undefined,
    phone: "",
    email: "",
    status: true,
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
