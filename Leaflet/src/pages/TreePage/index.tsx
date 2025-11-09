import { useState, useEffect, useMemo } from "react";
import { Toast, TabBar } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { getDailyLimit } from "../../services/airplane.service";

export default function TreePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dailyLimit, setDailyLimit] = useState({ used: 0, limit: 3 });

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/tree")) return "/tree";
    if (location.pathname.startsWith("/record")) return "/record";
    if (location.pathname.startsWith("/encouragement"))
      return "/encouragement";
    if (location.pathname.startsWith("/my")) return "/my";
    return "/tree";
  }, [location.pathname]);

  // 获取今日捞取次数
  useEffect(() => {
    getDailyLimit()
      .then((res) => {
        setDailyLimit(res.data);
      })
      .catch(() => {
        // Mock 数据兜底
        setDailyLimit({ used: 0, limit: 3 });
      });
  }, []);

  // "写纸折纸"按钮点击
  const handleWrite = () => {
    navigate("/airplane/write");
  };

  // "摘纸飞机"按钮点击
  const handlePick = () => {
    if (dailyLimit.used >= dailyLimit.limit) {
      Toast.show("今日纸飞机已捞完，明天再来吧～");
      return;
    }
    navigate("/airplane/pick");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e8f5f0 0%, #f0faf6 100%)",
        padding: "24px 16px 76px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 1 }}>
        <h2 style={{ margin: 0, color: "#1a7f5a", fontSize: 24 }}>
          我的心情树
        </h2>
        <div style={{ color: "#6aa893", marginTop: 4, fontSize: 14 }}>
          记录成长，匿名分享
        </div>
      </div>

      {/* 心情树卡片 */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "32px 24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {/* SVG 树形图 */}
        <div style={{ marginBottom: 20, height: 190 }}>
          <svg
            width="200"
            height="240"
            viewBox="0 0 200 240"
            style={{ margin: "0 auto", display: "block" }}
          >
            {/* 树干 */}
            <rect
              x="85"
              y="140"
              width="30"
              height="100"
              fill="#8B4513"
              rx="4"
            />
            {/* 左侧树冠 */}
            <circle
              cx="80"
              cy="100"
              r="55"
              fill="#3dd598"
              opacity="0.9"
            />
            {/* 右侧树冠 */}
            <circle
              cx="130"
              cy="90"
              r="50"
              fill="#52e6ad"
              opacity="0.85"
            />
            {/* 纸飞机装饰 - 左上 */}
            <rect
              x="50"
              y="70"
              width="20"
              height="16"
              fill="white"
              rx="2"
            />
            {/* 纸飞机装饰 - 左下 */}
            <rect
              x="60"
              y="120"
              width="18"
              height="14"
              fill="white"
              rx="2"
            />
            {/* 纸飞机装饰 - 右 */}
            <rect
              x="140"
              y="65"
              width="20"
              height="16"
              fill="white"
              rx="2"
            />
          </svg>
        </div>

        {/* 等级徽章 */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              backgroundColor: "#00a878",
              color: "white",
              padding: "6px 14px",
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            等级 1
          </span>
        </div>

        {/* 记录天数 */}
        <div
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2b2b2b",
            marginBottom: 8,
          }}
        >
          已记录 0 天
        </div>
        <div style={{ color: "#00a878", fontSize: 14 }}>
          开始第一次记录，解锁你的香樟树苗！
        </div>
      </div>

      {/* 两个核心按钮 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          width: "100%",
          maxWidth: 400,
          height: 110,
        }}
      >
        {/* 写纸折纸按钮 */}
        <div
          onClick={handleWrite}
          style={{
            flex: 1,
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
            borderRadius: 16,
            padding: "20px 16px",
            color: "white",
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(0,168,120,0.3)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>✈️</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            写纸折纸
          </div>
        </div>

        {/* 摘纸飞机按钮 */}
        <div
          onClick={handlePick}
          style={{
            flex: 1,
            cursor:
              dailyLimit.used >= dailyLimit.limit
                ? "not-allowed"
                : "pointer",
            background:
              dailyLimit.used >= dailyLimit.limit
                ? "linear-gradient(135deg, #b0b0b0 0%, #d0d0d0 100%)"
                : "linear-gradient(135deg, #00bfa5 0%, #00d4b8 100%)",
            borderRadius: 16,
            padding: "20px 16px",
            color: "white",
            textAlign: "center",
            boxShadow:
              dailyLimit.used >= dailyLimit.limit
                ? "none"
                : "0 4px 16px rgba(0,191,165,0.3)",
            opacity: dailyLimit.used >= dailyLimit.limit ? 0.7 : 1,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            摘纸飞机
          </div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            {dailyLimit.used >= dailyLimit.limit
              ? "今日已用完"
              : `今日剩余 ${dailyLimit.limit - dailyLimit.used
              } 次`}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #eee",
        }}
      >
        <TabBar
          activeKey={activeKey}
          onChange={(key) => {
            navigate(key);
          }}
        >
          <TabBar.Item
            key="/tree"
            icon={<span style={{ fontSize: 20 }}>🌳</span>}
            title="心情树"
          />
          <TabBar.Item
            key="/record"
            icon={<span style={{ fontSize: 20 }}>📝</span>}
            title="心情记录"
          />
          <TabBar.Item
            key="/encouragement"
            icon={<span style={{ fontSize: 20 }}>💬</span>}
            title="每日鼓励"
          />
          <TabBar.Item
            key="/my"
            icon={<span style={{ fontSize: 20 }}>�</span>}
            title="我的"
          />
        </TabBar>
      </div>
    </div>
  );
}
