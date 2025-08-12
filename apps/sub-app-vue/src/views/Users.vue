<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-button type="success" @click="addUser">添加用户</el-button>
            <el-button type="primary" @click="$router.push('/')"
              >返回首页</el-button
            >
          </div>
        </div>
      </template>

      <div class="users-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table :data="users" style="width: 100%">
              <el-table-column prop="id" label="用户ID" width="100" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="email" label="邮箱" width="200" />
              <el-table-column prop="phone" label="电话" width="150" />
              <el-table-column prop="role" label="角色" width="120">
                <template #default="scope">
                  <el-tag :type="getRoleType(scope.row.role)">
                    {{ scope.row.role }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="'active'"
                    :inactive-value="'inactive'"
                    @change="handleStatusChange(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="viewUser(scope.row)"
                    >查看</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editUser(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteUser(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <div class="pagination-wrapper">
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createTime: string;
}

const users = ref<User[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

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

const handleStatusChange = (user: User) => {
  console.log("用户状态变更:", user);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 这里可以重新加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 这里可以重新加载数据
};

onMounted(() => {
  users.value = mockUsers;
  total.value = mockUsers.length;
});
</script>

<style scoped>
.users-page {
  background: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.users-content {
  margin-top: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: center;
}
</style>
