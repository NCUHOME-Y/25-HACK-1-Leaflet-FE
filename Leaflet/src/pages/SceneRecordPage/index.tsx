import { useState, useEffect } from "react";
import { Button } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { recordMind, getAllRecords } from "../../services/mind.service";
import { useUser } from "../../lib/hooks/useUser";

// 本地定义记录的接口类型
interface MindRecord {
    id?: string;
    content: string;
    timestamp?: string;
}

export default function SceneRecordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [records, setRecords] = useState<MindRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    // 从路由状态获取场景信息
    const scene = location.state?.scene || "";
    const tag_id = location.state?.tag_id || 0; // 接收数字ID
    const emoji = location.state?.emoji || "";

    useEffect(() => {
        loadAllRecords();
    }, []);

    // 快速模板
    const quickTemplates = [
        "今天因为___，感到___。",
        "此刻的心情是___。",
        "希望明天能___。",
        "感谢今天的___。",
    ];

    const loadAllRecords = async () => {
        try {
            const response = await getAllRecords();
            setRecords(response.data || []);
        } catch (error) {
            console.error("加载记录失败:", error);
        }
    };

    const handlePublish = async () => {
        if (!content.trim()) {
            return;
        }
        if (content.length > 200) {
            return;
        }

        setLoading(true);
        try {
            // 只传递后端需要的 tag_id 和 content
            await recordMind({
                tag_id: tag_id, // 已经是数字类型
                content: content.trim(),
            });

            // 清空输入框并重新加载记录
            setContent("");
            loadAllRecords();

            // 显示成功提示
            setShowSuccessMsg(true);
        } catch (error) {
            console.error("保存记录失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueHere = () => {
        setShowSuccessMsg(false);
    };

    const handleGoBack = () => {
        navigate("/record");
    };

    const handleBack = () => {
        navigate("/record");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
                padding: "20px",
            }}
        >
            {/* 成功提示 */}
            {showSuccessMsg && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.4)",
                            zIndex: 9998,
                        }}
                    />
                    {/* 提示卡片 */}
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#fff",
                            padding: "32px 28px 28px",
                            borderRadius: "20px",
                            boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                            zIndex: 9999,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            maxWidth: "320px",
                            width: "85%",
                        }}
                    >
                        <div style={{ fontSize: "56px" }}>🌱</div>
                        <div style={{ 
                            fontSize: "18px", 
                            color: "#1a7f5a", 
                            fontWeight: 600,
                            textAlign: "center",
                            lineHeight: "1.5"
                        }}>
                            你的心情已被记录下来啦～
                        </div>
                        <div style={{ 
                            fontSize: "13px", 
                            color: "#6aa893",
                            textAlign: "center",
                            lineHeight: "1.6"
                        }}>
                            每一次记录，都是在滋养内心的小香樟呢喵
                        </div>
                        
                        {/* 按钮组 */}
                        <div style={{ 
                            display: "flex", 
                            flexDirection: "column",
                            gap: "12px",
                            width: "100%",
                            marginTop: "8px"
                        }}>
                            <Button
                                color="primary"
                                block
                                onClick={handleContinueHere}
                                style={{
                                    borderRadius: "12px",
                                    height: "46px",
                                    fontSize: "15px",
                                    fontWeight: 600
                                }}
                            >
                                继续写写这里的感受 ✨
                            </Button>
                            <Button
                                block
                                onClick={handleGoBack}
                                style={{
                                    borderRadius: "12px",
                                    height: "46px",
                                    fontSize: "15px",
                                    background: "linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)",
                                    color: "#2d6a4f",
                                    border: "none",
                                    fontWeight: 500
                                }}
                            >
                                去记录其他心情 🌈
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* 头部 */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    gap: "12px",
                }}
            >
                <Button
                    fill="none"
                    size="small"
                    onClick={handleBack}
                    style={{ padding: "4px 8px" }}
                >
                    ← 返回
                </Button>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span style={{ fontSize: "24px" }}>{emoji}</span>
                    <h3 style={{ margin: 0, color: "#1a7f5a" }}>{scene}</h3>
                </div>
            </div>

            {/* 输入区域 */}
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
            >
                <p
                    style={{
                        fontSize: "14px",
                        color: "#6aa893",
                        marginBottom: "12px",
                    }}
                >
                    记录下此刻的感受和想法
                </p>

                {/* 记录卡片 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "#f6fffb",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        border: "1px solid #dff7ec",
                    }}
                >
                    <div style={{ fontSize: "22px" }}>{emoji}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: "#1a7f5a", fontWeight: 600 }}>
                            {scene}
                        </div>
                        <div style={{ fontSize: "12px", color: "#7fbf9b" }}>
                            当前有若干人在此场景
                        </div>
                    </div>
                </div>

                <textarea
                    placeholder="写下你的心情（100字内）"
                    value={content}
                    onChange={(e) => {
                        const v = (e.target as HTMLTextAreaElement).value;
                        if (v.length <= 100) setContent(v);
                    }}
                    maxLength={100}
                    rows={6}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "12px",
                        background: "#fafafa",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        resize: "vertical",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {quickTemplates.map((t, i) => (
                            <Button
                                key={i}
                                size="mini"
                                fill="outline"
                                onClick={() =>
                                    setContent((prev) =>
                                        prev ? prev + " " + t : t
                                    )
                                }
                                style={{
                                    borderColor: "#dff7ec",
                                    color: "#2b8a66",
                                }}
                            >
                                {t.replace(/___/g, "...")}
                            </Button>
                        ))}
                    </div>

                    <div style={{ fontSize: "12px", color: "#999" }}>
                        {content.length}/100
                    </div>
                </div>

                <Button
                    color="primary"
                    block
                    onClick={handlePublish}
                    loading={loading}
                >
                    保存记录
                </Button>
            </div>

            {/* 历史记录 */}
            {records.length > 0 && (
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                >
                    <h4
                        style={{
                            margin: "0 0 16px 0",
                            color: "#1a7f5a",
                            fontSize: "16px",
                        }}
                    >
                        历史记录
                    </h4>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {records.map((record, index) => (
                            <div
                                key={record.id || index}
                                style={{
                                    padding: "12px",
                                    background: "#f9fbf9",
                                    borderRadius: "8px",
                                    borderLeft: "3px solid #4fb386",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "0 0 8px 0",
                                        fontSize: "14px",
                                        color: "#2b2b2b",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    {record.content}
                                </p>
                                {record.timestamp && (
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "12px",
                                            color: "#999",
                                        }}
                                    >
                                        {new Date(
                                            record.timestamp
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
