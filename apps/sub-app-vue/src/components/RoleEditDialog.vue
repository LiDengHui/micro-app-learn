<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="900px"
    @update:model-value="emit('update:visible', $event)"
    @close="handleClose"
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
          :disabled="mode === 'view'"
        />
      </el-form-item>

      <el-form-item label="角色标识" prop="role">
        <el-input
          v-model="roleForm.role"
          placeholder="请输入角色标识"
          :disabled="mode === 'view'"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="roleForm.status"
          :disabled="mode === 'view'"
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
          :disabled="mode === 'view'"
        />
      </el-form-item>

      <!-- 菜单权限配置 -->
      <el-form-item label="菜单权限" prop="menu">
        <div class="menu-permission-container">
          <div class="menu-tree-container">
            <div class="menu-tree-header">
              <h4>菜单树</h4>
              <el-button size="small" type="primary" link @click="expandAll">
                展开全部
              </el-button>
              <el-button size="small" type="primary" link @click="collapseAll">
                收起全部
              </el-button>
            </div>
            <el-tree
              ref="treeRef"
              :data="menuList"
              :props="{ label: 'title', children: 'children' }"
              node-key="id"
              show-checkbox
              :default-expand-all="false"
              :check-strictly="false"
              highlight-current
              expand-on-click-node="{false}"
              @node-click="handleMenuNodeClick"
              @check="handleMenuCheck"
              :disabled="mode === 'view'"
            >
              <template #default="{ data }">
                <span>{{ data.title }}</span>
              </template>
            </el-tree>
          </div>
          <div class="permission-container">
            <div
              v-if="currentMenuNode && currentMenuNode.permissions"
              class="permission-list"
            >
              <div class="permission-header">
                <h4>{{ currentMenuNode.title }} - 权限配置</h4>
                <div class="permission-actions">
                  <el-button
                    size="small"
                    type="primary"
                    link
                    @click="selectAllPermissions"
                    :disabled="mode === 'view'"
                  >
                    全选
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    link
                    @click="clearAllPermissions"
                    :disabled="mode === 'view'"
                  >
                    清空
                  </el-button>
                </div>
              </div>
              <el-checkbox-group
                v-model="currentPermissions"
                :disabled="mode === 'view'"
                @change="handlePermissionChange"
              >
                <el-checkbox
                  v-for="permission in currentMenuNode.permissions"
                  :key="permission.id"
                  :label="permission.value"
                >
                  {{ permission.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else-if="currentMenuNode" class="permission-list">
              <div class="permission-header">
                <h4>{{ currentMenuNode.title }}</h4>
              </div>
              <div class="permission-info">
                <p>该菜单项没有可配置的权限</p>
              </div>
            </div>
            <div v-else class="permission-placeholder">
              <el-empty description="请选择左侧菜单项来配置权限" />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
          v-if="mode !== 'view'"
        >
          {{ mode === "create" ? "创建" : "更新" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Role, CreateRoleDto, UpdateRoleDto, Menu } from "../api/role";

interface Props {
  visible: boolean;
  mode: "create" | "edit" | "view";
  roleData?: Role;
  menuList: Menu[];
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", data: CreateRoleDto | UpdateRoleDto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const formRef = ref<FormInstance>();
const treeRef = ref();
const submitLoading = ref(false);
const currentMenuNode = ref<Menu | null>(null);
const currentPermissions = ref<string[]>([]);

// 角色表单
const roleForm = reactive<CreateRoleDto & { id?: number }>({
  name: "",
  role: "",
  status: true,
  remark: "",
  menu: [],
});

// 表单验证规则
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

// 计算属性
const dialogTitle = computed(() => {
  switch (props.mode) {
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

// 监听对话框显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.roleData) {
      // 编辑或查看模式，填充表单数据
      Object.assign(roleForm, {
        ...props.roleData,
      });

      // 设置菜单权限选中状态
      nextTick(() => {
        if (props.roleData?.menus && props.roleData.menus.length > 0) {
          setMenuCheckedKeysWithPermissions(props.roleData);
        }
      });
    } else if (newVal && props.mode === "create") {
      // 创建模式，重置表单
      resetForm();
    }
  }
);

// 方法
const handleClose = () => {
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  Object.assign(roleForm, {
    id: undefined,
    name: "",
    role: "",
    status: true,
    remark: "",
    menu: [],
  });
  currentMenuNode.value = null;
  currentPermissions.value = [];
  formRef.value?.clearValidate();
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([]);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 获取选中的菜单和权限
    const checkedKeys = treeRef.value?.getCheckedKeys() || [];
    const selectedMenus = getSelectedMenus(props.menuList, checkedKeys);

    // 收集所有权限
    const allPermissions: any[] = [];
    const collectPermissions = (menus: Menu[]) => {
      menus.forEach((menu) => {
        if (menu.meta?.permission) {
          allPermissions.push(...menu.meta.permission);
        }
        if (menu.children) {
          collectPermissions(menu.children);
        }
      });
    };
    collectPermissions(selectedMenus);

    const formData = {
      ...roleForm,
      menu: selectedMenus,
      permissions: allPermissions,
    };

    emit("submit", formData);
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || error.message || "表单验证失败"
    );
  } finally {
    submitLoading.value = false;
  }
};

const handleMenuNodeClick = (data: Menu) => {
  currentMenuNode.value = data;
  // 初始化权限数据
  currentPermissions.value = data.meta?.permission || [];
};

const handleMenuCheck = (data: Menu, checkedInfo: any) => {
  // 处理菜单选中状态变化
  console.log("菜单选中状态变化:", data, checkedInfo);
};

const handlePermissionChange = (values: string[]) => {
  // 更新当前菜单的权限
  if (currentMenuNode.value) {
    if (!currentMenuNode.value.meta) {
      currentMenuNode.value.meta = {};
    }
    currentMenuNode.value.meta.permission = [...values];
  }
};

const expandAll = () => {
  treeRef.value?.expandAll();
};

const collapseAll = () => {
  treeRef.value?.collapseAll();
};

const selectAllPermissions = () => {
  if (currentMenuNode.value?.permissions) {
    currentPermissions.value = currentMenuNode.value.permissions.map(
      (p) => p.value
    );
    handlePermissionChange(currentPermissions.value);
  }
};

const clearAllPermissions = () => {
  currentPermissions.value = [];
  handlePermissionChange([]);
};

// 旧的方法已替换为 setMenuCheckedKeysWithPermissions

/**
 * 设置菜单选中状态和权限（参考 Write.vue 的逻辑）
 */
const setMenuCheckedKeysWithPermissions = (roleData: Role) => {
  if (!roleData.menus || !roleData.permissions) return;

  // 构建选中菜单的权限映射
  const checked: Array<{ id: number; permission: string[] }> = [];

  const eachTree = (menus: Menu[], callback: (menu: Menu) => void) => {
    menus.forEach((menu) => {
      callback(menu);
      if (menu.children) {
        eachTree(menu.children, callback);
      }
    });
  };

  // 遍历角色菜单，构建权限映射
  eachTree(roleData.menus, (menu) => {
    const menuPermissions = (menu.permissions || [])
      .filter((permission) =>
        roleData.permissions?.find(
          (rolePermission) => rolePermission.id === permission.id
        )
      )
      .map((permission) => permission.value);

    checked.push({
      id: menu.id,
      permission: menuPermissions,
    });
  });

  // 更新菜单树的权限数据
  eachTree(props.menuList, (menu) => {
    const index = checked.findIndex((item) => item.id === menu.id);
    if (index > -1) {
      if (!menu.meta) menu.meta = {};
      menu.meta.permission = checked[index].permission;
    }
  });

  // 设置选中状态
  checked.forEach((item) => {
    treeRef.value?.setChecked(item.id, true, false);
  });
};

const getSelectedMenus = (menus: Menu[], checkedKeys: number[]): Menu[] => {
  const filter = (
    menuList: Menu[],
    predicate: (menu: Menu) => boolean
  ): Menu[] => {
    return menuList.filter(predicate).map((menu) => ({
      ...menu,
      children: menu.children ? filter(menu.children, predicate) : [],
    }));
  };

  return filter(menus, (menu) => checkedKeys.includes(menu.id));
};
</script>

<style scoped>
.menu-permission-container {
  display: flex;
  gap: 20px;
  min-height: 400px;
}

.menu-tree-container {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background-color: #fafbfc;
}

.menu-tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.menu-tree-header h4 {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.permission-container {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background-color: #fafbfc;
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.permission-header h4 {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.permission-actions {
  display: flex;
  gap: 8px;
}

.permission-info {
  padding: 20px;
  text-align: center;
  color: #909399;
}

.permission-info p {
  margin: 0;
  font-size: 14px;
}

.permission-list .el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-checkbox) {
  margin-right: 16px;
  margin-bottom: 8px;
}
</style>
