import { useState, useEffect } from "react";
import { Button, Toast, Image, Space, CenterPopup, TextArea } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { pickAirplane, publishAirplane } from "../../services/airplane.service";
import airplanePickImg from "../../assets/images/airplane-pick.png";

export default function AirplanePickPage() {
    const navigate = useNavigate();
    const [airplaneContent, setAirplaneContent] = useState<string | null>(null);
    const [replyVisible, setReplyVisible] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [sending, setSending] = useState(false);

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

        // 0.8秒后模拟捞取结果
        const timer = setTimeout(() => {
            pickAirplane()
                .then((res) => {
                    if (res.data.message === "暂无纸飞机") {
                        setAirplaneContent(null);
                        Toast.show("当前暂无新纸飞机，稍后再来试试吧～");
                    } else {
                        setAirplaneContent(res.data.content);
                        Toast.show("纸飞机已打开！");
                    }
                })
                .catch(() => {
                    // Mock 数据兜底 - 模拟有别人的纸飞机
                    const mockAirplanes = [
                        "今天早八好困，但坚持住了！加油💪",
                        "图书馆刷了一下午题，累但充实～希望大家考试都能过！",
                        "食堂的红烧肉真的太好吃了！心情瞬间变好😋",
                        "明天就要考试了，有点紧张，但我相信自己一定可以的！",
                        "今天和朋友聊了很久，感觉压力释放了不少，谢谢陪伴❤️",
                        "睡前复盘一下今天，虽然有些小遗憾，但明天继续努力！晚安🌙",
                        "终于完成了小组作业，团队协作真的很重要！",
                        "在操场跑了几圈，运动后心情好多了🏃",
                    ];
                    const randomContent = mockAirplanes[Math.floor(Math.random() * mockAirplanes.length)];
                    setAirplaneContent(randomContent);
                    Toast.show("纸飞机已打开！");
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
            await publishAirplane(replyContent.trim());
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

            {airplaneContent ? (
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
                            ✈️
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
                            onClick={() => navigate("/tree")}
                            style={{
                                borderColor: "#00a878",
                                color: "#00a878",
                                borderRadius: 12,
                                height: 48,
                                fontSize: 16,
                            }}
                        >
                            🌳 返回心情树
                        </Button>
                    </Space>
                </div>
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        maxWidth: 400,
                        margin: "0 auto",
                    }}
                >
                    <div style={{ fontSize: 64, marginBottom: 20 }}>📭</div>
                    <p style={{ fontSize: 18, color: "#666", marginBottom: 8 }}>
                        当前暂无新纸飞机
                    </p>
                    <p style={{ fontSize: 14, color: "#999" }}>
                        稍后再来试试吧～
                    </p>
                    <Button
                        color="primary"
                        size="large"
                        onClick={() => navigate("/tree")}
                        style={{
                            marginTop: 30,
                            background: "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                            border: "none",
                            borderRadius: 12,
                            padding: "12px 40px",
                        }}
                    >
                        返回心情树
                    </Button>
                </div>
            )}

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
