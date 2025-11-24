import { useState } from "react";
import { Button, Toast, Space, Tag } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { getEncouragementMessage } from "../../services/encouragement.service";

export default function EncouragementPage() {
  const navigate = useNavigate();
  const [todayEncouragement, setTodayEncouragement] = useState<string | null>(
    null
  );
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetEncouragement = async () => {
    setIsLoading(true);
    try {
      const message = await getEncouragementMessage();
      setTodayEncouragement(message);
      setIsFetched(true);
      Toast.show({ content: "获取成功！", duration: 1500 });
    } catch (error) {
      console.error("获取鼓励语失败:", error);
      const errorMessage = error instanceof Error ? error.message : "网络错误";
      Toast.show({
        content: `获取失败: ${errorMessage}`,
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
    if ((window as any).umami) {
      (window as any).umami.track("获取鼓励语");
    } else {
      window.addEventListener(
        "umami:ready",
        () => {
          (window as any).umami?.track("获取鼓励语");
        },
        { once: true }
      );
    }
    if ((window as any).umami) {
      (window as any).umami.track("获取鼓励语");
    } else {
      window.addEventListener(
        "umami:ready",
        () => {
          (window as any).umami?.track("获取鼓励语");
        },
        { once: true }
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(225, 240, 236, 1)",
      }}
    >
      <h2
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          textAlign: "left",
          fontSize: "36px",
          color: "rgba(111, 128, 106, 1)",
        }}
      >
        每日鼓励
      </h2>
      <p
        style={{
          fontSize: "14px",
          color: "#666",
          margin: "10px 0",
          textAlign: "left",
        }}
      >
        温暖的话语，陪你前行 🌟
      </p>

      {/* 鼓励语卡片 */}
      <div
        style={{
          border: "1px solid #d8f3dc",
          borderRadius: "12px",
          padding: "24px 20px",
          margin: "0 auto 32px",
          maxWidth: "400px",
          height: "250Px",
          backgroundColor: "#f8fff7",
          boxShadow: "0 2px 8px rgba(0,168,120,0.1)",
        }}
      >
        <Space align="center" direction="vertical" style={{ width: "100%" }}>
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "36px",
                color: "#00a878",
                borderRadius: "12px",
              }}
            >
              🌟今日鼓励语
            </div>
            {isFetched ? (
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  color: "#333",
                }}
              >
                {todayEncouragement}
              </div>
            ) : (
              <Tag color="success" style={{ marginTop: "12px" }}>
                待获取
              </Tag>
            )}
          </div>
        </Space>
      </div>

      {/* 操作按钮 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Button
          color="primary"
          size="large"
          onClick={handleGetEncouragement}
          loading={isLoading}
          disabled={isFetched}
          style={{
            backgroundColor: isFetched ? "#ccc" : "#00a878",
            borderColor: isFetched ? "#ccc" : "#00a878",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
          }}
        >
          {isFetched ? "今日已获取" : "✨ 获取今日鼓励"}
        </Button>

        <Button
          color="default"
          size="large" 
          fill="outline"
          onClick={() => navigate("/solve-replies")}
          style={{
            backgroundColor: isFetched ? "#ccc" : "#00a878",
            borderColor: isFetched ? "#ccc" : "#00a878",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
          }}
        >
          💌 他人回信
        </Button>
      </div>

      {/* 温馨提示 */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "13px",
          color: "#999",
          marginBottom: 32,
        }}
      >
        想你的风吹到了NCU ❤️
      </div>
    </div>
  );
}
