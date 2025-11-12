import { useEffect, useState } from "react";
import { Toast } from "antd-mobile";
import { getAllRecords, MindRecord } from "../../services/mind.service";

export default function RecordPage() {
    const [records, setRecords] = useState<MindRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllRecords()
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setRecords(data as MindRecord[]);
                    return;
                }
                // 后端可能包裹在 data.records
                if (data && Array.isArray(data.records)) {
                    setRecords(data.records as MindRecord[]);
                    return;
                }
                setRecords([]);
            })
            .catch((err) => {
                console.error("获取心情记录失败:", err);
                Toast.show({ icon: "fail", content: "获取记录失败" });
            })
            .finally(() => setLoading(false));
    }, []);

    const renderTime = (ts?: string) => {
        if (!ts) return "未知时间";
        try {
            const d = new Date(ts);
            return d.toLocaleString();
        } catch {
            return ts;
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
                padding: "12px 16px",
                boxSizing: "border-box",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: "#1a7f5a" }}>个人心情档案</h2>
                <div style={{ color: "#6aa893", fontSize: 12 }}>查看你的所有记录（按时间倒序）</div>
            </div>

            <div style={{ maxWidth: 760, margin: "0 auto" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 40 }}>加载中…</div>
                ) : records.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#666" }}>暂无记录，快去写下第一条吧～</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {records
                            .slice()
                            .sort((a, b) => {
                                const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                                const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                                return tb - ta;
                            })
                            .map((r) => (
                                <div
                                    key={r.id || `${r.sceneKey}-${r.timestamp || Math.random()}`}
                                    style={{
                                        background: "#fff",
                                        borderRadius: 12,
                                        padding: 12,
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#2b2b2b" }}>{r.scene || r.sceneKey}</div>
                                        <div style={{ fontSize: 12, color: "#999" }}>{renderTime(r.timestamp)}</div>
                                    </div>
                                    <div style={{ fontSize: 14, color: "#333", whiteSpace: "pre-wrap" }}>{r.content}</div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
