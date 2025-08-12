import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "#28a745";
      case "处理中":
        return "#ffc107";
      case "待付款":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const viewOrder = (order: Order) => {
    console.log("查看订单:", order);
  };

  const editOrder = (order: Order) => {
    console.log("编辑订单:", order);
  };

  return (
    <div className="page-container" style={{ background: "#f5f5f5" }}>
      <div className="content-area">
        <div
          style={{ background: "white", padding: "20px", borderRadius: "8px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1>订单管理</h1>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              返回首页
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    订单ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    客户名称
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    产品名称
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    金额
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    状态
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    创建时间
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "12px" }}>{order.id}</td>
                    <td style={{ padding: "12px" }}>{order.customer}</td>
                    <td style={{ padding: "12px" }}>{order.product}</td>
                    <td style={{ padding: "12px" }}>¥{order.amount}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          color: "white",
                          background: getStatusColor(order.status),
                          fontSize: "12px",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{order.date}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => viewOrder(order)}
                        style={{
                          padding: "4px 8px",
                          marginRight: "5px",
                          background: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        查看
                      </button>
                      <button
                        onClick={() => editOrder(order)}
                        style={{
                          padding: "4px 8px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
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
