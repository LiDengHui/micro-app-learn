import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createTime: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
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
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "管理员":
        return "#dc3545";
      case "编辑":
        return "#ffc107";
      case "用户":
        return "#28a745";
      default:
        return "#6c757d";
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

  const handleStatusChange = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
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
            <h1>用户管理</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addUser}
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                添加用户
              </button>
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
                    用户ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    姓名
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    邮箱
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    电话
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    角色
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "12px" }}>{user.id}</td>
                    <td style={{ padding: "12px" }}>{user.name}</td>
                    <td style={{ padding: "12px" }}>{user.email}</td>
                    <td style={{ padding: "12px" }}>{user.phone}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          color: "white",
                          background: getRoleColor(user.role),
                          fontSize: "12px",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={user.status === "active"}
                          onChange={() => handleStatusChange(user.id)}
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span style={{ fontSize: "12px" }}>
                          {user.status === "active" ? "启用" : "禁用"}
                        </span>
                      </label>
                    </td>
                    <td style={{ padding: "12px" }}>{user.createTime}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => viewUser(user)}
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
                        onClick={() => editUser(user)}
                        style={{
                          padding: "4px 8px",
                          marginRight: "5px",
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
                      <button
                        onClick={() => deleteUser(user)}
                        style={{
                          padding: "4px 8px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        删除
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

export default Users;
