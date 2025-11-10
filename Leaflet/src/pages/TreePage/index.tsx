import { useState, useEffect, useMemo } from "react";
import { Toast, TabBar } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { getDailyLimit } from "../../services/airplane.service";

// 添加动画样式
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes gentle-sway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
  
  @keyframes paper-plane-fly {
    0% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(5px) translateY(-3px); }
    50% { transform: translateX(10px) translateY(0px); }
    75% { transform: translateX(5px) translateY(3px); }
    100% { transform: translateX(0px) translateY(0px); }
  }
  
  @keyframes bird-fly {
    0% { transform: translateX(0px) translateY(0px); }
    33% { transform: translateX(3px) translateY(-2px); }
    66% { transform: translateX(6px) translateY(1px); }
    100% { transform: translateX(0px) translateY(0px); }
  }
  
  .floating { animation: float 3s ease-in-out infinite; }
  .swaying { animation: gentle-sway 4s ease-in-out infinite; transform-origin: bottom center; }
  .twinkling { animation: twinkle 2s ease-in-out infinite; }
  .paper-plane { animation: paper-plane-fly 5s ease-in-out infinite; }
  .bird-flying { animation: bird-fly 3s ease-in-out infinite; }
`;

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
    <>
      <style>{animationStyles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e8f5f0 0%, #f0faf6 50%, #e6f7f2 100%)",
          padding: "20px 16px 76px",
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
        {/* SVG 树形图 - 卡通可爱风格 */}
        <div style={{ marginBottom: 20, height: 240, position: "relative" }}>
          <svg
            width="240"
            height="260"
            viewBox="0 0 240 260"
            style={{ margin: "0 auto", display: "block" }}
            className="swaying"
          >
            {/* 可爱的云朵背景 */}
            <ellipse cx="60" cy="40" rx="25" ry="15" fill="#ffeaa7" opacity="0.3" className="floating"/>
            <ellipse cx="180" cy="35" rx="20" ry="12" fill="#ffeaa7" opacity="0.25" className="floating" style={{ animationDelay: "1s" }}/>
            
            {/* 地面小草 */}
            <ellipse cx="50" cy="240" rx="8" ry="4" fill="#81c784" opacity="0.6"/>
            <ellipse cx="70" cy="242" rx="6" ry="3" fill="#66bb6a" opacity="0.5"/>
            <ellipse cx="170" cy="241" rx="7" ry="3.5" fill="#81c784" opacity="0.55"/>
            <ellipse cx="190" cy="239" rx="5" ry="2.5" fill="#66bb6a" opacity="0.5"/>
            
            {/* 可爱的树干 - 圆润胖乎乎 */}
            <rect
              x="105"
              y="160"
              width="30"
              height="80"
              fill="#d4a574"
              rx="15"
              ry="15"
            />
            <rect
              x="108"
              y="155"
              width="24"
              height="15"
              fill="#e4b588"
              rx="12"
              ry="8"
            />
            
            {/* 树干可爱的眼睛 */}
            <circle cx="115" cy="180" r="3" fill="#2c3e50"/>
            <circle cx="125" cy="180" r="3" fill="#2c3e50"/>
            <circle cx="116" cy="179" r="1" fill="white"/>
            <circle cx="126" cy="179" r="1" fill="white"/>
            
            {/* 树干可爱的嘴巴 */}
            <path d="M 115 188 Q 120 191, 125 188" stroke="#2c3e50" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            
            {/* 树干红脸蛋 */}
            <ellipse cx="108" cy="185" rx="3" ry="2" fill="#ff6b6b" opacity="0.4"/>
            <ellipse cx="132" cy="185" rx="3" ry="2" fill="#ff6b6b" opacity="0.4"/>
            
            {/* 主要树冠 - 大而圆润 */}
            <circle cx="120" cy="80" r="50" fill="#74b9ff" opacity="0.9"/>
            <circle cx="90" cy="100" r="35" fill="#a29bfe" opacity="0.8"/>
            <circle cx="150" cy="95" r="38" fill="#81ecec" opacity="0.85"/>
            
            {/* 装饰性小树冠 */}
            <circle cx="105" cy="120" r="25" fill="#55efc4" opacity="0.7"/>
            <circle cx="135" cy="115" r="22" fill="#74b9ff" opacity="0.7"/>
            
            {/* 树冠上的可爱表情 */}
            <circle cx="105" cy="75" r="2.5" fill="#2c3e50"/>
            <circle cx="135" cy="70" r="2.5" fill="#2c3e50"/>
            <circle cx="106" cy="74" r="0.8" fill="white"/>
            <circle cx="136" cy="69" r="0.8" fill="white"/>
            <path d="M 105 82 Q 120 85, 135 82" stroke="#2c3e50" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            
            {/* 可爱的纸飞机 - 简化版 */}
            <g transform="translate(65, 90)" className="paper-plane">
              <path d="M 0 4 L 12 0 L 12 2 L 4 4 L 12 6 L 12 8 L 0 4 Z" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="1"/>
            </g>
            
            <g transform="translate(165, 85)" className="paper-plane" style={{ animationDelay: "1.5s" }}>
              <path d="M 0 3 L 10 0 L 10 1.5 L 3 3 L 10 4.5 L 10 6 L 0 3 Z" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="1"/>
            </g>
            
            <g transform="translate(95, 130)" className="paper-plane" style={{ animationDelay: "2.5s" }}>
              <path d="M 0 2.5 L 8 0 L 8 1 L 2.5 2.5 L 8 4 L 8 5 L 0 2.5 Z" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="0.8"/>
            </g>
            
            {/* 可爱的小果实 */}
            <circle cx="85" cy="85" r="4" fill="#ff7675"/>
            <circle cx="155" cy="80" r="3.5" fill="#fd79a8"/>
            <circle cx="120" cy="105" r="3" fill="#e17055"/>
            
            {/* 果实上的高光 */}
            <circle cx="86" cy="84" r="1" fill="white" opacity="0.6"/>
            <circle cx="156" cy="79" r="0.8" fill="white" opacity="0.5"/>
            <circle cx="121" cy="104" r="0.6" fill="white" opacity="0.4"/>
            
            {/* 装饰性星星 */}
            <g transform="translate(70, 60)" className="twinkling">
                <path d="M 0,-4 L 1,-1 L 4,-1 L 1,1 L 2,4 L 0,2 L -2,4 L -1,1 L -4,-1 L -1,-1 Z" fill="#ffeaa7" opacity="0.7"/>
            </g>
            
            <g transform="translate(170, 55)" className="twinkling" style={{ animationDelay: "0.8s" }}>
                <path d="M 0,-3 L 0.8,-0.8 L 3,-0.8 L 0.8,0.8 L 1.5,3 L 0,1.5 L -1.5,3 L -0.8,0.8 L -3,-0.8 L -0.8,-0.8 Z" fill="#ffeaa7" opacity="0.6"/>
            </g>
            
            {/* 小鸟装饰 */}
            <g transform="translate(50, 45)" className="bird-flying">
              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#ff6b6b"/>
              <circle cx="1" cy="-1" r="0.5" fill="white"/>
              <circle cx="1.2" cy="-1" r="0.2" fill="black"/>
              <path d="M -4 0 Q -6 -1, -7 0" stroke="#ff6b6b" strokeWidth="1" fill="none"/>
              <path d="M 4 0 Q 6 -1, 7 0" stroke="#ff6b6b" strokeWidth="1" fill="none"/>
            </g>
            
            {/* 彩虹装饰 */}
            <path d="M 30 30 Q 120 10, 210 30" stroke="#ff6b6b" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M 30 35 Q 120 15, 210 35" stroke="#4ecdc4" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M 30 40 Q 120 20, 210 40" stroke="#ffeaa7" strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>
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
    </>
  );
}
