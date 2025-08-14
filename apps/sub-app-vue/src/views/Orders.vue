<template>
  <div class="list-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <h1>订单管理</h1>
          <p>管理系统订单信息</p>
          <el-button type="primary" @click="$router.push('/')"
            >返回首页</el-button
          >
        </div>
      </template>

      <div class="orders-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table :data="orders" style="width: 100%">
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
              <el-table-column prop="date" label="创建时间" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" @click="viewOrder(scope.row)"
                    >查看</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editOrder(scope.row)"
                    >编辑</el-button
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

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

const orders = ref<Order[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

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
@import '../styles/common.scss';

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-content {
  margin-top: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: center;
}
</style>
