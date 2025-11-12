import { useState, useEffect } from "react";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { getDailyLimit } from "../../services/airplane.service";
import treeImage from "../../assets/images/tree/tree.png";

export default function TreePage() {
  const navigate = useNavigate();
  const [dailyLimit, setDailyLimit] = useState({ used: 0, limit: 3 });

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
        background: "linear-gradient(135deg, #e8f5f0 0%, #f0faf6 50%, #e6f7f2 100%)",
        padding: "20px 16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
        {/* 背景装饰 */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(116, 185, 255, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "100px",
          left: "-30px",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(255, 154, 0, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        {/* 标题 */}
        <div style={{
          textAlign: "center",
          marginBottom: 20,
          zIndex: 1,
          position: "relative"
        }}>
          <h2 style={{
            margin: 0,
            color: "#1a7f5a",
            fontSize: 26,
            fontWeight: "bold",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            我的心情树
          </h2>
          <div style={{
            color: "#6aa893",
            marginTop: 6,
            fontSize: 14,
            fontWeight: "500"
          }}>
            记录成长，匿名分享
          </div>
        </div>

        {/* 心情树卡片 */}
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
            borderRadius: 24,
            padding: "32px 24px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.8)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* 树形图片 */}
          <div style={{ marginBottom: 20, height: 240, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src={treeImage}
              alt="心情树"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
              }}
            />
          </div>

          {/* 等级徽章 */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                color: "white",
                padding: "8px 18px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,168,120,0.3)",
                display: "inline-block",
              }}
            >
              🌱 等级 1
            </span>
          </div>

          {/* 记录天数 */}
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#2b2b2b",
              marginBottom: 8,
            }}
          >
            已记录 0 天
          </div>
          <div style={{
            color: "#00a878",
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 1.4
          }}>
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
              background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
              borderRadius: 20,
              padding: "22px 16px",
              color: "white",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,168,120,0.3)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,168,120,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,168,120,0.3)";
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 8 }}>✈️</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              写纸折纸
            </div>
          </div>

          {/* 摘纸飞机按钮 */}
          <div
            onClick={handlePick}
            style={{
              flex: 1,
              cursor: dailyLimit.used >= dailyLimit.limit ? "not-allowed" : "pointer",
              background: dailyLimit.used >= dailyLimit.limit
                ? "linear-gradient(135deg, #b0b0b0 0%, #d0d0d0 100%)"
                : "linear-gradient(135deg, #00bfa5 0%, #00d4b8 100%)",
              borderRadius: 20,
              padding: "22px 16px",
              color: "white",
              textAlign: "center",
              boxShadow: dailyLimit.used >= dailyLimit.limit
                ? "none"
                : "0 8px 24px rgba(0,191,165,0.3)",
              opacity: dailyLimit.used >= dailyLimit.limit ? 0.7 : 1,
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (dailyLimit.used < dailyLimit.limit) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,191,165,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (dailyLimit.used < dailyLimit.limit) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,191,165,0.3)";
              }
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 8 }}>✉️</div>
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
                : `今日剩余 ${dailyLimit.limit - dailyLimit.used} 次`}
            </div>
          </div>
        </div>
    </div>
  );
}
