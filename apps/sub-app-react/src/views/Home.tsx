import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ background: "#f5f5f5" }}>
      <div className="content-area">
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h1>React 子应用 - 首页</h1>
          <p>这是一个使用 React Router 的微前端子应用</p>

          <div style={{ marginTop: "30px" }}>
            <h3>页面导航</h3>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={() => navigate("orders")}
                style={{
                  padding: "10px 20px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                订单列表
              </button>
              <button
                onClick={() => navigate("users")}
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                用户管理
              </button>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <h3>React 组件演示</h3>
            <p>这里可以展示各种 React 组件和功能</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
