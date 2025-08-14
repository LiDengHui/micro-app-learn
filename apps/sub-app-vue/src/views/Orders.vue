<template>
  <div class="list-page">
    <div class="page-header">
      <h1>订单管理</h1>
      <p>管理系统订单信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单"
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
        <el-button type="primary" @click="$router.push('/')">
          <el-icon><Back /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="filteredOrders"
        style="width: 100%"
        border
        stripe
      >
              <el-table-column prop="id" label="订单ID" width="120" />
              <el-table-column prop="customer" label="客户名称" width="150" />
              <el-table-column prop="product" label="产品名称" />
              <el-table-column prop="amount" label="金额" width="120">
                <template #default="scope"> ¥{{ scope.row.amount }} </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="订单ID" width="120" />
        <el-table-column prop="customer" label="客户名称" width="150" />
        <el-table-column prop="product" label="产品名称" min-width="200" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <TableActionButtons :max-visible="1">
              <el-button size="small" type="info" link @click="viewOrder(row)">
                查看
              </el-button>
              <el-button size="small" type="primary" link @click="editOrder(row)">
                编辑
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
import { Search, Back } from "@element-plus/icons-vue";
import TableActionButtons from "../components/TableActionButtons.vue";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

// 响应式数据
const loading = ref(false);
const searchQuery = ref("");
const orders = ref<Order[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 模拟数据
const mockOrders: Order[] = [
  {
    id: "ORD001",
    customer: "张三",
    product: "iPhone 15",
    amount: 6999,
    status: "已完成",
    date: "2024-01-15",
  },
  {
    id: "ORD002",
    customer: "李四",
    product: "MacBook Pro",
    amount: 12999,
    status: "处理中",
    date: "2024-01-16",
  },
  {
    id: "ORD003",
    customer: "王五",
    product: "iPad Air",
    amount: 4599,
    status: "待付款",
    date: "2024-01-17",
  },
  {
    id: "ORD004",
    customer: "赵六",
    product: "AirPods Pro",
    amount: 1999,
    status: "已完成",
    date: "2024-01-18",
  },
  {
    id: "ORD005",
    customer: "钱七",
    product: "Apple Watch",
    amount: 2999,
    status: "处理中",
    date: "2024-01-19",
  },
];

// 计算属性
const filteredOrders = computed(() => {
  if (!searchQuery.value) {
    return orders.value;
  }
  return orders.value.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
};

const getStatusType = (status: string) => {
  switch (status) {
    case "已完成":
      return "success";
    case "处理中":
      return "warning";
    case "待付款":
      return "danger";
    default:
      return "info";
  }
};

const viewOrder = (order: Order) => {
  console.log("查看订单:", order);
};

const editOrder = (order: Order) => {
  console.log("编辑订单:", order);
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
  orders.value = mockOrders;
  total.value = mockOrders.length;
});
</script>

<style scoped>
@import "../styles/common.scss";
</style>
