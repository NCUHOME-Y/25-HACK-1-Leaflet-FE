import { useEffect, useMemo, useState } from "react";
import { Empty, ErrorBlock, List, SpinLoading, Toast } from "antd-mobile";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSolve } from "../../services/airplane.service";

interface ReplyItem {
    id: string | number;
    solution: string;
    createdAt?: string;
    problemId?: string | number;
    userId?: string | number;
}

function normalizeSolveData(raw: any): ReplyItem[] {
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.solves))
        return [];
    return raw.solves
        .map((s: any, idx: number) => ({
            id: s.ID || s.id || idx,
            solution: String(s.solution || s.reply || s.answer || ""),
            createdAt: s.CreatedAt || s.created_at || undefined,
            problemId: s.problem_id || s.problemId || undefined,
            userId: s.user_id || s.userId || undefined,
        }))
        .filter((r: ReplyItem) => r.solution !== "");
}

export default function SolveReplyPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [list, setList] = useState<ReplyItem[]>([]);

    const getMyProblemIds = (): string[] => {
        try {
            const raw = localStorage.getItem("myProblemIds");
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr.map((x) => String(x)) : [];
        } catch {
            return [];
        }
    };

    const refresh = () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setList([]);
            setError("请先登录后查看他人回信");
            setLoading(false);
            return;
        }
        // 请求仅返回“与我有关”的回信（需要后端支持 ?mine=1）
        getSolve({ mine: 1 })
            .then((res) => {
                const data = res?.data ?? res;
                let items = normalizeSolveData(data);
                // 前端兜底：若后端未按 mine 过滤，则按本地记录的我的问题ID过滤
                const myIds = getMyProblemIds();
                if (myIds.length) {
                    items = items.filter(
                        (it) =>
                            it.problemId !== undefined &&
                            myIds.includes(String(it.problemId))
                    );
                }
                const injected = location.state?.injected
                    ? [
                          {
                              id: `injected-${Date.now()}`,
                              solution: location.state.injected.solution || "",
                              createdAt: location.state.injected.createdAt,
                          },
                      ]
                    : [];
                setList([...items, ...injected]);
            })
            .catch((err) => {
                console.error("❌ 刷新失败", err);
                const msg =
                    err?.response?.data?.message || err?.message || "刷新失败";
                setError(msg);
                Toast.show({ content: msg });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refresh();
    }, []);

    const content = useMemo(() => {
        if (loading)
            return (
                <div style={{ padding: 32, textAlign: "center" }}>
                    <SpinLoading style={{ "--size": "32px" }} />
                </div>
            );
        if (error)
            return (
                <ErrorBlock
                    description={error}
                    style={{ background: "#fff", borderRadius: 12, margin: 12 }}
                />
            );
        if (!list.length)
            return (
                <Empty
                    description="暂无他人回信"
                    style={{ padding: "40px 0" }}
                />
            );

        return (
            <div
                style={{
                    height: "calc(100vh - 100px)",
                    overflowY: "auto",
                    padding: "0 12px 12px",
                }}
            >
                <div style={{ textAlign: "right", margin: "8px 0 4px" }}>
                    <button
                        style={{
                            background: "#00a878",
                            border: "none",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: "pointer",
                        }}
                        onClick={refresh}
                    >
                        刷新
                    </button>
                </div>
                <List>
                    {list.map((item) => (
                        <List.Item key={item.id}>
                            <div
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e9f5ef",
                                    borderRadius: 12,
                                    padding: 12,
                                    boxShadow: "0 2px 8px rgba(0,168,120,0.08)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "#6aa893",
                                        marginBottom: 6,
                                    }}
                                >
                                    他人回信
                                </div>
                                <div
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #eaeaea",
                                        borderRadius: 8,
                                        padding: 10,
                                        whiteSpace: "pre-wrap",
                                        color: "#2b2b2b",
                                    }}
                                >
                                    {item.solution}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 8,
                                    }}
                                >
                                    {item.problemId && (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: "#95d5b2",
                                            }}
                                        >
                                            问题ID: {item.problemId}
                                        </span>
                                    )}
                                    {item.createdAt && (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: "#999",
                                            }}
                                        >
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString("zh-CN", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </List.Item>
                    ))}
                </List>
            </div>
        );
    }, [loading, error, list]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    cursor: "pointer",
                    zIndex: 20,
                }}
                onClick={() => navigate("/tree")}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 20px rgba(0,168,120,0.12)",
                        transition: "all 0.2s",
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
            <div style={{ paddingTop: 70 }}>
                <h2
                    style={{ textAlign: "center", margin: 0, color: "#1a7f5a" }}
                >
                    他人回信
                </h2>
            </div>
            {content}
        </div>
    );
}
