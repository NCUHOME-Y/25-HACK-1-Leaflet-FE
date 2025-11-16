import { useState } from "react";
import { TextArea, Button, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { publishAirplane } from "../../services/airplane.service";

export default function AirplaneWritePage() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handlePublish = async () => {
        if (!content.trim()) {
            Toast.show({
                icon: "fail",
                content: "请输入内容",
            });
            return;
        }
        if (content.length > 200) {
            Toast.show({
                icon: "fail",
                content: "字数不能超过200字",
            });
            return;
        }

        try {
            setIsSending(true);
            const res = await publishAirplane(content);
            // 尝试从返回中提取我发布的纸飞机ID并记录到本地，便于过滤“给我”的回信
            try {
                const pid =
                    res?.data?.problem?.ID ||
                    res?.data?.problem?.id ||
                    res?.data?.ID ||
                    res?.data?.id;
                if (pid) {
                    const key = "myProblemIds";
                    const raw = localStorage.getItem(key);
                    const list = raw ? JSON.parse(raw) : [];
                    const next = Array.isArray(list)
                        ? Array.from(
                              new Set([
                                  ...list.map((x: any) => String(x)),
                                  String(pid),
                              ])
                          )
                        : [String(pid)];
                    localStorage.setItem(key, JSON.stringify(next));
                }
            } catch {}
            // 显示“纸飞机已飞走～” + 静态图
            Toast.show({
                content: "纸飞机已飞走～",
                duration: 3000,
            });
            // 发送成功后返回心情树
            navigate("/tree", { replace: true });
        } catch (error: any) {
            // 解析审核失败等后端错误并弹出提示
            const errData = error?.response?.data;
            const baseMsg =
                errData?.error || errData?.message || "发送失败，请重试";
            const reason = errData?.reason ? `（${errData.reason}）` : "";
            const finalMsg = `${baseMsg}${reason}`;

            // 审核不通过时使用 alert 明确提示
            if (
                typeof baseMsg === "string" &&
                (baseMsg.includes("未通过审核") || baseMsg.includes("审核"))
            ) {
                window.alert(finalMsg);
            }
            Toast.show({ icon: "fail", content: finalMsg });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #e8f5f0 0%, #f0faf6 100%)",
                padding: "20px",
                paddingBottom: "80px",
                boxSizing: "border-box",
                position: "relative",
            }}
        >
            {/* 返回按钮 */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    cursor: "pointer",
                    zIndex: 10,
                }}
                onClick={() => navigate(-1)}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s",
                    }}
                >
                    <Icon
                        icon="solar:arrow-left-outline"
                        width="20"
                        height="20"
                        color="#00a878"
                    />
                </div>
            </div>

            {/* 顶部标题区 */}
            <div
                style={{ textAlign: "center", marginBottom: 32, marginTop: 20 }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Icon
                        icon="ph:paper-plane-tilt-fill"
                        width="48"
                        height="48"
                        color="#00a878"
                    />
                </div>
                <h2
                    style={{
                        margin: 0,
                        color: "#1a7f5a",
                        fontSize: 26,
                        fontWeight: 600,
                        marginBottom: 8,
                    }}
                >
                    书写纸飞机
                </h2>
                <p style={{ fontSize: 14, color: "#6aa893", margin: 0 }}>
                    写下你的感受，它会飞向远方
                </p>
            </div>

            {/* 输入卡片 */}
            <div
                style={{
                    maxWidth: 500,
                    margin: "0 auto",
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "0 8px 24px rgba(0,168,120,0.12)",
                    border: "2px solid #d8f3dc",
                    marginBottom: 24,
                }}
            >
                {/* 装饰标签 */}
                <div
                    style={{
                        display: "inline-block",
                        background:
                            "linear-gradient(135deg, #00a878 0%, #00c896 100%)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}
                >
                    匿名分享
                </div>

                {/* 输入框 */}
                <TextArea
                    placeholder="写下你的心情，可以是开心的事、烦恼、想法...&#10;&#10;你的文字会被折成纸飞机，飘向远方～"
                    value={content}
                    onChange={setContent}
                    maxLength={200}
                    rows={8}
                    showCount
                    style={{
                        "--font-size": "16px",
                        "--color": "#2b2b2b",
                        background: "#f8fcfa",
                        border: "1px solid #d8f3dc",
                        borderRadius: "12px",
                        padding: "12px",
                        lineHeight: "1.6",
                    }}
                />

                {/* 字数提示 */}
                <div
                    style={{
                        textAlign: "right",
                        fontSize: 12,
                        color: content.length > 180 ? "#ff6b6b" : "#95d5b2",
                        marginTop: 8,
                        fontWeight: 500,
                    }}
                >
                    {content.length}/200 字
                </div>
            </div>

            {/* 发送按钮 */}
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
                <Button
                    color="primary"
                    size="large"
                    block
                    onClick={handlePublish}
                    loading={isSending}
                    disabled={!content.trim() || isSending}
                    style={{
                        background: content.trim()
                            ? "linear-gradient(135deg, #00a878 0%, #00c896 100%)"
                            : "#d8f3dc",
                        border: "none",
                        borderRadius: 12,
                        height: 52,
                        fontSize: 17,
                        fontWeight: 600,
                        color: content.trim() ? "#fff" : "#95d5b2",
                    }}
                >
                    {isSending ? "折纸中..." : "折成纸飞机并放飞"}
                </Button>
            </div>
        </div>
    );
}
