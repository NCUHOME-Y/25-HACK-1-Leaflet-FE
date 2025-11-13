import { useState, useEffect } from "react";
import { Button, Toast, Image, Space, CenterPopup, TextArea } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getSolve, replyToAirplane } from "../../services/airplane.service";
import airplanePickImg from "../../assets/images/airplane-pick.png";

interface ComfortMessage {
    content: string;
    timestamp: string;
}

export default function AirplanePickPage() {
    const navigate = useNavigate();
    const [airplaneContent, setAirplaneContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 添加加载状态
    const [replyVisible, setReplyVisible] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [sending, setSending] = useState(false);
    const [comfortList, setComfortList] = useState<ComfortMessage[]>([]); // 收到的安慰列表

    useEffect(() => {
        // 显示"正在取下纸飞机～" + 静态图
        Toast.show({
            content: "正在取下纸飞机～",
            duration: 800,
            icon: (
                <Image
                    src={airplanePickImg}
                    style={{ width: "80px", height: "80px" }}
                />
            ),
        });

        // 0.8秒后调用获取情绪疏导接口
        const timer = setTimeout(() => {

            // 真实接口调用
            setIsLoading(true);
            getSolve()
                .then((res) => {
                    setIsLoading(false);
                    const data = res.data;

                    // 检查是否超出每日次数限制
                    if (data.limitExceeded || data.exceed || data.message?.includes("超出") || data.message?.includes("限制")) {
                        setAirplaneContent(null);
                        Toast.show({
                            icon: "fail",
                            content: data.message || "今日摘取次数已用完，明天再来吧～",
                            duration: 2500,
                        });
                        // 3秒后返回心情树
                        setTimeout(() => {
                            navigate("/tree");
                        }, 3000);
                        return;
                    }

                    // 检查是否有纸飞机内容
                    if (data.message === "暂无纸飞机" || !data.content) {
                        setAirplaneContent(null);
                        Toast.show("当前暂无新纸飞机，稍后再来试试吧～");
                    } else {
                        setAirplaneContent(data.content);
                        // 如果后端返回了安慰信息，添加到列表
                        if (data.comfort) {
                            const newComfort: ComfortMessage = {
                                content: data.comfort,
                                timestamp: new Date().toISOString(),
                            };
                            setComfortList(prev => [newComfort, ...prev]);
                        }
                        Toast.show("纸飞机已打开！");
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("获取纸飞机失败:", error);
                    // 检查错误响应中是否包含次数限制信息
                    const errorMsg = error.response?.data?.message || error.message || "";
                    if (errorMsg.includes("超出") || errorMsg.includes("限制") || errorMsg.includes("次数")) {
                        setAirplaneContent(null);
                        Toast.show({
                            icon: "fail",
                            content: errorMsg || "今日摘取次数已用完，明天再来吧～",
                            duration: 2500,
                        });
                        setTimeout(() => {
                            navigate("/tree");
                        }, 3000);
                    } else {
                        // 显示错误信息
                        setAirplaneContent(null);
                        Toast.show({
                            icon: "fail",
                            content: "获取纸飞机失败，请稍后重试",
                        });
                    }
                });
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleReply = () => {
        setReplyVisible(true);
    };

    const handleSendReply = async () => {
        if (!replyContent.trim()) {
            Toast.show("请输入回复内容");
            return;
        }
        if (replyContent.length > 100) {
            Toast.show("回复内容不能超过100字");
            return;
        }

        setSending(true);
        try {
            await replyToAirplane(replyContent.trim());
            // 将发送的回复添加到安慰列表
            const newComfort: ComfortMessage = {
                content: replyContent.trim(),
                timestamp: new Date().toISOString(),
            };
            setComfortList(prev => [newComfort, ...prev]);

            Toast.show({
                icon: "success",
                content: "回复已发送～",
            });
            setReplyVisible(false);
            setReplyContent("");
            // 1秒后返回心情树
            setTimeout(() => {
                navigate("/tree");
            }, 1000);
        } catch (error) {
            console.error("发送回复失败:", error);
            Toast.show("发送失败，请重试");
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #e8f5f0 0%, #f0faf6 100%)",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, color: "#1a7f5a", fontSize: 24 }}>
                    ✉️ 摘取纸飞机
                </h2>
                <div style={{ color: "#6aa893", fontSize: 14, marginTop: 8 }}>
                    看看别人分享的心情～
                </div>
            </div>

            {isLoading ? (
                <div
                    style={{
                        maxWidth: 500,
                        margin: "0 auto",
                        background: "#ffffff",
                        borderRadius: "20px",
                        padding: "60px 40px",
                        textAlign: "center",
                        boxShadow: "0 8px 24px rgba(0,168,120,0.12)",
                        border: "2px solid #d8f3dc",
                    }}
                >
                    <div
                        style={{
                            marginBottom: 20,
                            animation: "float 2s ease-in-out infinite",
                        }}
                    >
                        <Icon icon="mingcute:send-plane-line" width="64" height="64" color="#00a878" />
                    </div>
                    <div style={{ fontSize: 18, color: "#00a878", fontWeight: 600, marginBottom: 8 }}>
                        正在打开纸飞机
                    </div>
                    <div style={{ fontSize: 14, color: "#95d5b2" }}>
                        请稍候...
                    </div>
                    <style>{`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                    `}</style>
                </div>
            ) : !airplaneContent ? (
                <div
                    style={{
                        maxWidth: 500,
                        margin: "0 auto",
                        background: "#ffffff",
                        borderRadius: "20px",
                        padding: "60px 40px",
                        textAlign: "center",
                        boxShadow: "0 8px 24px rgba(0,168,120,0.12)",
                        border: "2px solid #d8f3dc",
                    }}
                >
                    <div style={{ marginBottom: 20, opacity: 0.6 }}>
                        <Icon icon="mingcute:send-plane-line" width="64" height="64" color="#52b788" />
                    </div>
                    <div style={{ fontSize: 18, color: "#52b788", fontWeight: 600, marginBottom: 8 }}>
                        暂无新纸飞机
                    </div>
                    <div style={{ fontSize: 14, color: "#95d5b2", marginBottom: 30 }}>
                        稍后再来看看吧～
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                            color="primary"
                            size="large"
                            block
                            onClick={() => window.location.reload()}
                            style={{
                                background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                                border: "none",
                                borderRadius: 12,
                                padding: "12px 40px",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            🔄 刷新摘取
                        </Button>
                        <Button
                            fill="outline"
                            size="large"
                            block
                            onClick={() => navigate("/tree")}
                            style={{
                                borderColor: "#00a878",
                                color: "#00a878",
                                borderRadius: 12,
                                padding: "12px 40px",
                                fontSize: 16,
                            }}
                        >
                            🌳 返回
                        </Button>
                    </div>
                </div>
            ) : airplaneContent ? (
                <div
                    style={{
                        maxWidth: 500,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            border: "2px solid #d8f3dc",
                            padding: "24px",
                            borderRadius: "16px",
                            marginBottom: "24px",
                            boxShadow: "0 8px 24px rgba(0,168,120,0.12)",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: -12,
                                right: 20,
                                background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                                color: "white",
                                padding: "6px 16px",
                                borderRadius: "12px",
                                fontSize: 12,
                                fontWeight: 600,
                                boxShadow: "0 4px 12px rgba(0,168,120,0.3)",
                            }}
                        >
                            来自树友的心情
                        </div>
                        <div
                            style={{
                                fontSize: 32,
                                textAlign: "center",
                                marginBottom: 16,
                            }}
                        >

                        </div>
                        <p
                            style={{
                                fontSize: 16,
                                lineHeight: 1.8,
                                color: "#2b2b2b",
                                margin: 0,
                                textAlign: "center",
                            }}
                        >
                            {airplaneContent}
                        </p>
                    </div>

                    <Space direction="vertical" block style={{ width: "100%" }}>
                        <Button
                            color="primary"
                            size="large"
                            block
                            onClick={handleReply}
                            style={{
                                background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                                border: "none",
                                borderRadius: 12,
                                height: 48,
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            💬 回复 TA
                        </Button>
                        <Button
                            fill="outline"
                            size="large"
                            block
                            onClick={() => window.location.reload()}
                            style={{
                                borderColor: "#00a878",
                                color: "#00a878",
                                borderRadius: 12,
                                height: 48,
                                fontSize: 16,
                            }}
                        >
                            🔄 刷新
                        </Button>
                    </Space>

                    {/* 收到的安慰列表 */}
                    {comfortList.length > 0 && (
                        <div style={{ marginTop: 32 }}>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: "#1a7f5a",
                                    marginBottom: 16,
                                    textAlign: "center",
                                }}
                            >
                                💚 远方的慰藉
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {comfortList.map((comfort, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: "#ffffff",
                                            border: "1px solid #d8f3dc",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            boxShadow: "0 2px 8px rgba(0,168,120,0.08)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: "#2b2b2b",
                                                lineHeight: 1.6,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {comfort.content}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#95d5b2",
                                                textAlign: "right",
                                            }}
                                        >
                                            {new Date(comfort.timestamp).toLocaleString('zh-CN', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            {/* 回复弹窗 */}
            <CenterPopup
                visible={replyVisible}
                onMaskClick={() => setReplyVisible(false)}
                style={{
                    width: "90%",
                    maxWidth: "440px",
                    borderRadius: "20px",
                    padding: 0,
                    overflow: "visible",
                    boxShadow: "0 12px 48px rgba(0,168,120,0.2)",
                }}
            >
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "20px" }}>
                    {/* 顶部装饰渐变条 */}
                    <div
                        style={{
                            height: "6px",
                            background: "linear-gradient(90deg, #00a878 0%, #00c896 50%, #00d4b8 100%)",
                        }}
                    />

                    {/* 主内容区 */}
                    <div style={{ padding: "28px 24px 24px" }}>
                        {/* 关闭按钮 */}
                        <div
                            style={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                cursor: "pointer",
                                fontSize: 24,
                                color: "#bbb",
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                transition: "all 0.2s",
                            }}
                            onClick={() => setReplyVisible(false)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f0f0f0";
                                e.currentTarget.style.color = "#666";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#bbb";
                            }}
                        >
                            ✕
                        </div>

                        {/* 标题区域 */}
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <h3
                                style={{
                                    margin: "0 0 8px 0",
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: "#1a7f5a",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                回复纸飞机
                            </h3>
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#7fbf9b",
                                    lineHeight: 1.6,
                                }}
                            >
                                发送匿名回复，给TA一些温暖
                            </div>
                        </div>

                        {/* 输入框 */}
                        <div style={{ marginBottom: 20 }}>
                            <TextArea
                                placeholder="写下你的安慰... (100字以内)"
                                value={replyContent}
                                onChange={(val) => {
                                    if (val.length <= 100) {
                                        setReplyContent(val);
                                    }
                                }}
                                maxLength={100}
                                rows={5}
                                showCount
                                style={{
                                    background: "linear-gradient(135deg, #f6fffb 0%, #fafffe 100%)",
                                    borderRadius: 12,
                                    border: "2px solid #d8f3dc",
                                    fontSize: 15,
                                    padding: "12px",
                                    lineHeight: 1.6,
                                    width: "100%",
                                    boxSizing: "border-box",
                                    "--font-size": "15px",
                                    "--color": "#2b2b2b",
                                    "--placeholder-color": "#a0d9c0",
                                }}
                            />
                        </div>

                        {/* 发送按钮 */}
                        <Button
                            color="primary"
                            size="large"
                            block
                            onClick={handleSendReply}
                            loading={sending}
                            disabled={sending || !replyContent.trim()}
                            style={{
                                background:
                                    sending || !replyContent.trim()
                                        ? "linear-gradient(135deg, #d0d0d0 0%, #e0e0e0 100%)"
                                        : "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                                border: "none",
                                borderRadius: 12,
                                height: 52,
                                fontSize: 17,
                                fontWeight: 700,
                                boxShadow:
                                    sending || !replyContent.trim()
                                        ? "none"
                                        : "0 6px 20px rgba(0,168,120,0.3)",
                                transition: "all 0.3s",
                            }}
                        >
                            {sending ? "发送中..." : "💌 发送回复"}
                        </Button>
                    </div>
                </div>
            </CenterPopup>
        </div>
    );
}
