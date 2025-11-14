import { useEffect, useState } from "react";
import { Toast, TextArea, Button } from "antd-mobile";
import {
    getAllRecords,
    MindRecord,
    deleteRecord,
    updateRecord,
} from "../../services/mind.service";

// 标签ID到场景名称的映射
const TAG_NAMES: Record<number, string> = {
    1: "困倦的早八",
    2: "自习室刷题",
    3: "图书馆阅读",
    4: "食堂干饭",
    5: "备考冲刺",
    6: "社团活动",
    7: "情绪波动时",
    8: "睡前复盘",
    9: "社交活动后",
};

export default function RecordPage() {
    const [records, setRecords] = useState<MindRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        console.log(
            "==================== GET /status/mine ===================="
        );
        setLoading(true);
        getAllRecords()
            .then((res) => {
                console.log("📥 原始响应:", res);
                console.log("📥 响应数据 res.data:", res.data);
                console.log("📥 数据类型:", typeof res.data);
                console.log("📥 是否为数组:", Array.isArray(res.data));

                const data = res.data;

                // 尝试多种可能的数据结构
                let recordsList: MindRecord[] = [];

                if (Array.isArray(data)) {
                    console.log("✅ 数据是数组,长度:", data.length);
                    recordsList = data;
                } else if (data && typeof data === "object") {
                    console.log("📦 数据是对象,键:", Object.keys(data));

                    // 尝试各种可能的字段名
                    if (Array.isArray(data.records)) {
                        console.log(
                            "✅ 找到 data.records,长度:",
                            data.records.length
                        );
                        recordsList = data.records;
                    } else if (Array.isArray(data.data)) {
                        console.log(
                            "✅ 找到 data.data,长度:",
                            data.data.length
                        );
                        recordsList = data.data;
                    } else if (Array.isArray(data.list)) {
                        console.log(
                            "✅ 找到 data.list,长度:",
                            data.list.length
                        );
                        recordsList = data.list;
                    } else if (Array.isArray(data.result)) {
                        console.log(
                            "✅ 找到 data.result,长度:",
                            data.result.length
                        );
                        recordsList = data.result;
                    } else if (Array.isArray(data.items)) {
                        console.log(
                            "✅ 找到 data.items,长度:",
                            data.items.length
                        );
                        recordsList = data.items;
                    } else if (data.code === 200 && Array.isArray(data.data)) {
                        console.log(
                            "✅ 找到 data.code=200 且 data.data,长度:",
                            data.data.length
                        );
                        recordsList = data.data;
                    } else if (
                        data.status === 200 &&
                        Array.isArray(data.data)
                    ) {
                        console.log(
                            "✅ 找到 data.status=200 且 data.data,长度:",
                            data.data.length
                        );
                        recordsList = data.data;
                    } else {
                        // 如果都不匹配，尝试找到第一个数组类型的值
                        console.log(
                            "⚠️ 未找到标准字段，尝试查找数组类型的值..."
                        );
                        for (const key of Object.keys(data)) {
                            if (Array.isArray(data[key])) {
                                console.log(
                                    `✅ 找到数组字段: ${key}, 长度:`,
                                    data[key].length
                                );
                                recordsList = data[key];
                                break;
                            }
                        }
                    }
                }

                console.log("📝 最终记录列表:", recordsList);
                console.log("📝 记录数量:", recordsList.length);

                if (recordsList.length > 0) {
                    console.log("📝 第一条记录示例:", recordsList[0]);
                }

                setRecords(recordsList);
            })
            .catch((err) => {
                console.error("❌ 获取心情记录失败:", err);
                console.error("❌ 错误详情:", err.response?.data);
                Toast.show({ icon: "fail", content: "获取记录失败" });
            })
            .finally(() => setLoading(false));
    }, []);

    const renderTime = (ts?: string) => {
        if (!ts) return "未知时间";
        try {
            const d = new Date(ts);
            return d.toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return ts;
        }
    };

    // 获取记录的创建时间（尝试多个可能的字段）
    const getRecordTime = (record: any): string | undefined => {
        return (
            record.CreatedAt ||
            record.created_at ||
            record.createdAt ||
            record.create_time ||
            record.createTime ||
            record.time ||
            record.timestamp
        );
    };

    // 获取记录ID（尝试多个可能的字段）
    const getRecordId = (record: any): number | string => {
        // 优先使用小写的 id（后端确认字段名）
        const id = record.id || record.ID || record._id;
        console.log("🔍 获取记录ID:", {
            完整记录: JSON.stringify(record, null, 2),
            id字段值: record.id,
            id类型: typeof record.id,
            ID字段值: record.ID,
            _id字段值: record._id,
            tag_id字段值: record.tag_id,
            最终使用的ID: id,
            最终ID类型: typeof id,
        });

        if (!id) {
            console.error("❌ 警告：无法获取记录ID！记录对象:", record);
        }

        return id;
    };

    // 删除记录
    const handleDelete = async (record: MindRecord) => {
        console.log("🗑️ 点击删除按钮");
        console.log("原记录:", record);

        const recordId = getRecordId(record);
        console.log("记录ID:", recordId);
        console.log("记录ID类型:", typeof recordId);

        // 检查ID是否有效
        if (!recordId || recordId === "undefined") {
            console.error("❌ 无法删除：记录ID无效");
            Toast.show({
                icon: "fail",
                content: "删除失败：无法获取记录ID，请检查后端是否返回了id字段",
            });
            return;
        }

        console.log("准备弹出确认对话框...");

        // 使用原生确认对话框（因为 antd-mobile v5 不支持 React 19）
        const confirmed = window.confirm("确定要删除这条记录吗？");

        console.log("用户选择:", confirmed ? "确认删除" : "取消删除");

        if (confirmed) {
            Toast.show({ icon: "loading", content: "删除中...", duration: 0 });

            try {
                console.log("开始调用deleteRecord API...");
                await deleteRecord(recordId);
                console.log("✅ API调用成功");

                Toast.clear();
                Toast.show({ icon: "success", content: "删除成功" });

                // 从列表中移除该记录
                setRecords(records.filter((r) => getRecordId(r) !== recordId));
            } catch (error: any) {
                console.error("❌ 删除失败:", error);
                console.error("错误响应:", error.response);

                Toast.clear();
                Toast.show({ icon: "fail", content: "删除失败" });
            }
        }
    };

    // 开始编辑
    const handleEdit = (record: MindRecord) => {
        setEditingId(getRecordId(record));
        setEditContent(record.content);
    };

    // 保存编辑
    const handleSaveEdit = async (record: MindRecord) => {
        const recordId = getRecordId(record);
        console.log("🔧 开始保存编辑...");
        console.log("记录ID:", recordId);
        console.log("新内容:", editContent);
        console.log("原记录:", record);

        if (!editContent.trim()) {
            Toast.show({ content: "内容不能为空" });
            return;
        }

        Toast.show({ icon: "loading", content: "保存中...", duration: 0 });

        try {
            const result = await updateRecord(recordId, {
                tag_id: record.tag_id,
                content: editContent,
            });
            console.log("✅ 保存成功，响应:", result);

            Toast.clear();
            Toast.show({ icon: "success", content: "修改成功" });

            // 更新列表中的记录
            setRecords(
                records.map((r) =>
                    getRecordId(r) === recordId
                        ? { ...r, content: editContent }
                        : r
                )
            );
            setEditingId(null);
            setEditContent("");
        } catch (error: any) {
            console.error("❌ 保存失败:", error);
            console.error("错误响应:", error.response);

            Toast.clear();

            let errorMsg = "修改失败";
            if (error.response?.status === 404) {
                errorMsg = "记录不存在";
            } else if (error.response?.status === 400) {
                errorMsg = "参数错误";
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }

            Toast.show({ icon: "fail", content: errorMsg });
        }
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

    const getSceneName = (tagId: number) => {
        return TAG_NAMES[tagId] || `场景${tagId}`;
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
                <div style={{ color: "#6aa893", fontSize: 12 }}>
                    查看你的所有记录（按时间倒序）
                </div>
            </div>

            <div style={{ maxWidth: 760, margin: "0 auto" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                        加载中…
                    </div>
                ) : records.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#666",
                        }}
                    >
                        暂无记录，快去写下第一条吧～
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        {records
                            .slice()
                            .sort((a, b) => {
                                const ta = a.created_at
                                    ? new Date(a.created_at).getTime()
                                    : 0;
                                const tb = b.created_at
                                    ? new Date(b.created_at).getTime()
                                    : 0;
                                return tb - ta;
                            })
                            .map((r, index) => (
                                <div
                                    key={r.id || index}
                                    style={{
                                        background: "#fff",
                                        borderRadius: 12,
                                        padding: 16,
                                        boxShadow:
                                            "0 6px 18px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "#2b8a66",
                                                }}
                                            >
                                                {getSceneName(r.tag_id)}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: "#7fbf9b",
                                                    background: "#edfff5",
                                                    padding: "2px 8px",
                                                    borderRadius: 10,
                                                }}
                                            >
                                                {r.all_record_count}条记录
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#999",
                                            }}
                                        >
                                            {renderTime(getRecordTime(r))}
                                        </div>
                                    </div>
                                    {editingId === getRecordId(r) ? (
                                        <div style={{ marginBottom: 8 }}>
                                            <TextArea
                                                value={editContent}
                                                onChange={setEditContent}
                                                placeholder="请输入内容"
                                                rows={3}
                                                maxLength={500}
                                                showCount
                                                style={{ marginBottom: 8 }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleSaveEdit(r)
                                                    }
                                                >
                                                    保存
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={handleCancelEdit}
                                                >
                                                    取消
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: "#333",
                                                whiteSpace: "pre-wrap",
                                                lineHeight: 1.6,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {r.content}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "#999",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <span>📅</span>
                                            <span>
                                                创建时间:{" "}
                                                {renderTime(getRecordTime(r))}
                                            </span>
                                        </div>
                                        {editingId !== getRecordId(r) && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                }}
                                            >
                                                <Button
                                                    size="mini"
                                                    color="primary"
                                                    fill="outline"
                                                    onClick={() =>
                                                        handleEdit(r)
                                                    }
                                                >
                                                    ✏️ 编辑
                                                </Button>
                                                <Button
                                                    size="mini"
                                                    color="danger"
                                                    fill="outline"
                                                    onClick={() =>
                                                        handleDelete(r)
                                                    }
                                                >
                                                    🗑️ 删除
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
