import { useState, useEffect } from "react";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getDailyLimit } from "../../services/airplane.service";
import { getUserLevel, UserLevel } from "../../services/mind.service";
import treeImage from "../../assets/images/tree/treetrue.png";

export default function TreePage() {
  const navigate = useNavigate();
  const [dailyLimit, setDailyLimit] = useState({ used: 0, limit: 3 });
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    record_days: 0,
  });

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

  // 获取用户等级信息
  useEffect(() => {
    getUserLevel()
      .then((res) => {
        const d: any = res?.data ?? {};
        // 兼容不同字段命名与嵌套结构，保证 record_days 一定有值
        const level = d.level ?? d.data?.level ?? 1;
        const recordDays =
          d.record_days ?? d.recordDays ?? d.days ?? d.data?.record_days ?? 0;
        console.log("用户等级数据(规范化):", { level, recordDays });
        setUserLevel({ level, record_days: recordDays });
      })
      .catch((err) => {
        console.error("获取用户等级失败:", err);
        // 使用默认值
        setUserLevel({ level: 1, record_days: 0 });
      });
  }, []);

  // "写纸折纸"按钮点击
  const handleWrite = () => {
    navigate("/airplane/write");
    if ((window as any).umami) {
      (window as any).umami.track("写纸折纸");
    } else {
      window.addEventListener(
        "umami:ready",
        () => {
          (window as any).umami?.track("写纸折纸");
        },
        { once: true }
      );
    }
  };

  // "摘纸飞机"按钮点击
  const handlePick = () => {
    if (dailyLimit.used >= dailyLimit.limit) {
      Toast.show("今日纸飞机已捞完，明天再来吧～");
      return;
    }
    navigate("/airplane/pick");
    if ((window as any).umami) {
      (window as any).umami.track("摘纸飞机");
    } else {
      window.addEventListener(
        "umami:ready",
        () => {
          (window as any).umami?.track("摘纸飞机");
        },
        { once: true }
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px 16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(191, 207, 185, 0.67) 0%, rgba(247, 249, 246, 0.67) 100%)",
      }}
    >
      {/* 心情树卡片 */}
      <div
        style={{
          background:
            "linear-gradient(0deg, rgba(191, 207, 185, 0.67) 0%, rgba(247, 249, 246, 0.67) 100%)",
          borderRadius: 24,
          padding: "32px 24px",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 2,
          border: "1px solid rgba(255,255,255,0.8)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 标题 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 6,
            zIndex: 1,
            position: "relative",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#1a7f5a",
              fontSize: 26,
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            我的心情树
          </h2>
          <div
            style={{
              color: "#6aa893",
              marginTop: 0,
              fontSize: 10,
              fontWeight: "500",
            }}
          >
            记录成长，匿名分享
          </div>
        </div>

        {/* 树形图片 */}
        <div
          style={{
            marginBottom: 20,
            height: 450,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={treeImage}
            alt="心情树"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 记录 */}
        <div
          style={{
            color: "#00a878",
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 1.4,
          }}
        >
          {userLevel.record_days === 0
            ? "开始第一次记录，解锁你的香樟树苗！"
            : "继续加油，让心情树茁壮成长！"}
        </div>

        {/* 两个核心按钮（放入带边框的容器） */}
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            justifyContent: "center",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              width: "100%",
              padding: 12,
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            {/* 写纸折纸按钮 */}
            <div
              onClick={handleWrite}
              style={{
                flex: 1,
                cursor: "pointer",
                background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                border: "1px solid rgba(194, 103, 103, 0.6)",
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
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(0,168,120,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0,168,120,0.3)";
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>
                <Icon
                  icon="ph:paper-plane-tilt-fill"
                  width={30}
                  height={30}
                  color="#ffffff"
                />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>写纸飞机</div>
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
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.6)",
                padding: "22px 16px",
                color: "white",
                textAlign: "center",
                boxShadow:
                  dailyLimit.used >= dailyLimit.limit
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
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,191,165,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (dailyLimit.used < dailyLimit.limit) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,191,165,0.3)";
                }
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>
                <Icon
                  icon="mdi:email-outline"
                  width={30}
                  height={30}
                  color="#ffffff"
                />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                摘纸飞机
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
