import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./orders.module.css";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>([
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
  ]);

  const statusClassMap = useMemo(
    () => ({
      已完成: styles.statusCompleted,
      处理中: styles.statusProcessing,
      待付款: styles.statusPending,
    }),
    []
  );

  const viewOrder = (order: Order) => {
    console.log("查看订单:", order);
  };

  const editOrder = (order: Order) => {
    console.log("编辑订单:", order);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentArea}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>订单列表</h1>
            <button
              onClick={() => navigate("/")}
              className={styles.primaryButton}
            >
              返回首页
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.theadRow}>
                  <th className={styles.th}>订单ID</th>
                  <th className={styles.th}>客户名称</th>
                  <th className={styles.th}>产品名称</th>
                  <th className={styles.th}>金额</th>
                  <th className={styles.th}>状态</th>
                  <th className={styles.th}>创建时间</th>
                  <th className={styles.th}>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={styles.row}>
                    <td className={styles.td}>{order.id}</td>
                    <td className={styles.td}>{order.customer}</td>
                    <td className={styles.td}>{order.product}</td>
                    <td className={styles.td}>¥{order.amount}</td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.statusBadge} ${
                          statusClassMap[
                            order.status as keyof typeof statusClassMap
                          ]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.td}>{order.date}</td>
                    <td className={styles.td}>
                      <button
                        onClick={() => viewOrder(order)}
                        className={`${styles.button} ${styles.buttonGrey}`}
                      >
                        查看
                      </button>
                      <button
                        onClick={() => editOrder(order)}
                        className={`${styles.button} ${styles.buttonBlue}`}
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
