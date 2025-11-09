import { useMemo } from "react";
import { Grid, TabBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";

type Scene = {
  key: string;
  title: string;
  emoji: string;
  count: number;
};

const scenes: Scene[] = [
  { key: "early", title: "困倦的早八", emoji: "😴", count: 23 },
  { key: "study", title: "自习室刷题", emoji: "📝", count: 45 },
  { key: "library", title: "图书馆阅读", emoji: "📖", count: 18 },
  { key: "canteen", title: "食堂干饭", emoji: "🍚", count: 67 },
  { key: "exam", title: "备考冲刺", emoji: "⏳", count: 34 },
  { key: "club", title: "社团活动", emoji: "🎭", count: 12 },
  { key: "mood", title: "情绪波动时", emoji: "😡", count: 28 },
  { key: "review", title: "睡前复盘", emoji: "🌙", count: 56 },
  { key: "social", title: "社交活动后", emoji: "👥", count: 19 },
];

export default function MoodRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = useMemo(() => {
    // 让 TabBar 高亮当前路由
    if (location.pathname.startsWith("/tree")) return "/tree";
    if (location.pathname.startsWith("/record")) return "/record";
    if (location.pathname.startsWith("/encouragement"))
      return "/encouragement";
    if (location.pathname.startsWith("/my")) return "/my";
    return "/record";
  }, [location.pathname]);

  const handleClickScene = (scene: Scene) => {
    // 跳转到写纸条页面，并携带选中的场景（写页可按需读取）
    navigate("/airplane/write", { state: { scene: scene.title } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
        padding: "8px 16px 76px", // 预留底部 TabBar 高度
        boxSizing: "border-box",
      }}
    >
      {/* 标题区 */}
      <div style={{ textAlign: "center", marginBottom: 0 }}>
        <h2 style={{ margin: 0, color: "#1a7f5a" }}>记录今天的心情</h2>
        <div
          style={{
            color: "#6aa893",
            marginTop: 2,
            fontSize: 12,
            marginBottom: 2,
          }}
        >
          选择当前场景，分享你的感受
        </div>
      </div>

      {/* 场景九宫格 */}
      <Grid columns={2} gap={12}>
        {scenes.map((s) => (
          <Grid.Item key={s.key}>
            <div
              onClick={() => handleClickScene(s)}
              style={{
                cursor: "pointer",
                background: "#ffffff",
                borderRadius: 16,
                padding: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#e9fbf3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {s.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    color: "#2b2b2b",
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: "#4fb386" }}>
                  {s.count}位同学
                </div>
              </div>
            </div>
          </Grid.Item>
        ))}
      </Grid>

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
            // 仅跳转到现有路由，避免 404
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
