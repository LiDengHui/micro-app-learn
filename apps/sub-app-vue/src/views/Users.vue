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
          v-model="searchQuery"
          placeholder="搜索用户"
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
        <el-button type="primary" @click="addUser">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
        <el-button @click="$router.push('/')">
          <el-icon><Back /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="filteredUsers"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <TableActionButtons :max-visible="1">
              <el-button size="small" type="info" link @click="viewUser(row)">
                查看
              </el-button>
              <el-button
                size="small"
                type="primary"
                link
                @click="editUser(row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                link
                @click="deleteUser(row)"
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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Search, Plus, Back } from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createTime: string;
}

// 响应式数据
const loading = ref(false);
const searchQuery = ref("");
const users = ref<User[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 模拟数据
const mockUsers: User[] = [
  {
    id: "U001",
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138001",
    role: "管理员",
    status: "active",
    createTime: "2024-01-01",
  },
  {
    id: "U002",
    name: "李四",
    email: "lisi@example.com",
    phone: "13800138002",
    role: "用户",
    status: "active",
    createTime: "2024-01-02",
  },
  {
    id: "U003",
    name: "王五",
    email: "wangwu@example.com",
    phone: "13800138003",
    role: "编辑",
    status: "inactive",
    createTime: "2024-01-03",
  },
  {
    id: "U004",
    name: "赵六",
    email: "zhaoliu@example.com",
    phone: "13800138004",
    role: "用户",
    status: "active",
    createTime: "2024-01-04",
  },
  {
    id: "U005",
    name: "钱七",
    email: "qianqi@example.com",
    phone: "13800138005",
    role: "管理员",
    status: "active",
    createTime: "2024-01-05",
  },
];

// 计算属性
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 方法
const getRoleType = (role: string) => {
  switch (role) {
    case "管理员":
      return "danger";
    case "编辑":
      return "warning";
    case "用户":
      return "success";
    default:
      return "info";
  }
};

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
};

const addUser = () => {
  console.log("添加用户");
};

const viewUser = (user: User) => {
  console.log("查看用户:", user);
};

const editUser = (user: User) => {
  console.log("编辑用户:", user);
};

const deleteUser = (user: User) => {
  console.log("删除用户:", user);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 这里可以重新加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 这里可以重新加载数据
};

// 生命周期
onMounted(() => {
  users.value = mockUsers;
  total.value = mockUsers.length;
});
</script>

<style scoped>
@import "../styles/common.scss";
</style>
