import { useMemo } from "react";
import { TabBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/tree")) return "/tree";
    if (location.pathname.startsWith("/record")) return "/record";
    if (location.pathname.startsWith("/encouragement")) return "/encouragement";
    if (location.pathname.startsWith("/my")) return "/my";
    return "/tree";
  }, [location.pathname]);

  return (
    <>
      {/* 页面内容容器 */}
      <div
        style={{
          minHeight: "100vh",
          paddingBottom: "60px", // 为底部 TabBar 留出空间
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* 底部导航 TabBar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #eee",
          zIndex: 1000,
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
            icon={<span style={{ fontSize: 20 }}>👤</span>}
            title="我的"
          />
        </TabBar>
      </div>
    </>
  );
}