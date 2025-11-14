import { useMemo, useState, useEffect } from "react";
import { TabBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { updateSceneClick, getTagCount } from "../../services/mind.service";

type Scene = {
    id: number; // 后端需要的数字ID
    key: string;
    title: string;
    emoji: string;
    count: number;
};

const scenes: Scene[] = [
    { id: 1, key: "early", title: "困倦的早八", emoji: "😴", count: 23 },
    { id: 2, key: "study", title: "自习室刷题", emoji: "📝", count: 45 },
    { id: 3, key: "library", title: "图书馆阅读", emoji: "📖", count: 18 },
    { id: 4, key: "canteen", title: "食堂干饭", emoji: "🍚", count: 67 },
    { id: 5, key: "exam", title: "备考冲刺", emoji: "⏳", count: 34 },
    { id: 6, key: "club", title: "社团活动", emoji: "🎭", count: 12 },
    { id: 7, key: "mood", title: "情绪波动时", emoji: "😡", count: 28 },
    { id: 8, key: "review", title: "睡前复盘", emoji: "🌙", count: 56 },
    { id: 9, key: "social", title: "社交活动后", emoji: "👥", count: 19 },
];

export default function MoodRecordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [scenesWithCount, setScenesWithCount] = useState<Scene[]>(scenes);

    const activeKey = useMemo(() => {
        // 让 TabBar 高亮当前路由
        if (location.pathname.startsWith("/tree")) return "/tree";
        if (location.pathname.startsWith("/record")) return "/record";
        if (location.pathname.startsWith("/encouragement"))
            return "/encouragement";
        if (location.pathname.startsWith("/my")) return "/my";
        return "/record";
    }, [location.pathname]);

    // 页面加载时获取所有场景的实时人数
    useEffect(() => {
        const fetchAllCounts = async () => {
            try {
                // 并行请求所有场景的人数
                const countPromises = scenes.map((scene) =>
                    getTagCount(scene.id)
                        .then((res) => ({
                            id: scene.id,
                            count: res.data?.count || 0,
                        }))
                        .catch(() => ({ id: scene.id, count: 0 }))
                );

                const counts = await Promise.all(countPromises);

                // 更新场景数据
                const updatedScenes = scenes.map((scene) => {
                    const countData = counts.find((c) => c.id === scene.id);
                    return {
                        ...scene,
                        count: countData?.count || 0,
                    };
                });

                setScenesWithCount(updatedScenes);
            } catch (error) {
                console.error("获取场景人数失败:", error);
            }
        };

        fetchAllCounts();
    }, []);

    const handleClickScene = async (scene: Scene) => {
        try {
            // 更新场景点击次数
            await updateSceneClick(scene.key);

            // 跳转到场景记录页面，并携带场景信息(传递数字ID)
            navigate("/record/scene", {
                state: {
                    scene: scene.title,
                    tag_id: scene.id, // 传递数字ID给后端
                    emoji: scene.emoji,
                },
            });
        } catch (error) {
            console.error("更新场景点击失败:", error);
            // 即使更新失败也继续跳转
            navigate("/record/scene", {
                state: {
                    scene: scene.title,
                    tag_id: scene.id, // 传递数字ID给后端
                    emoji: scene.emoji,
                },
            });
        }
    };

    return (
        <div
            className="allow-scroll"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
                padding: "8px 16px 76px", // 预留底部 TabBar 高度
                boxSizing: "border-box",
            }}
        >
            {/* 标题区 */}
            <div style={{ textAlign: "center", marginBottom: 0 }}>
                <h2 style={{ margin: 0, color: "#1a7f5a" }}>记录今天的心情</h2>
                <div
                    style={{
                        color: "#6aa893",
                        marginTop: 2,
                        fontSize: 12,
                        marginBottom: 2,
                    }}
                >
                    选择当前场景，分享你的感受
                </div>
            </div>

            {/* 场景卡片响应式网格 */}
            <div className="scene-grid">
                {scenesWithCount.map((s) => (
                    <div
                        key={s.key}
                        className="scene-card"
                        onClick={() => handleClickScene(s)}
                    >
                        <div className="scene-emoji-wrapper">{s.emoji}</div>
                        <div style={{ width: "100%" }}>
                            <h3 className="scene-title">{s.title}</h3>
                            <div className="scene-count">{s.count}位同学</div>
                        </div>
                    </div>
                ))}
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
                        // 仅跳转到现有路由，避免 404
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
    );
}
