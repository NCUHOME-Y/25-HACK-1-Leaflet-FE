import { useState } from "react";
import {
    Button,
    Toast,
    Image,
    Space,
    CenterPopup,
    Input,
} from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../lib/hooks/useUser";
import avatar1 from "../../assets/images/avatar/avatar-1.png";
import avatar2 from "../../assets/images/avatar/avatar-2.png";
import avatar3 from "../../assets/images/avatar/avatar-3.png";
import avatar4 from "../../assets/images/avatar/avatar-4.png";
import avatar5 from "../../assets/images/avatar/avatar-5.png";
import avatar6 from "../../assets/images/avatar/avatar-6.png";
import iconArchive from "../../assets/images/icon-archive.png";
import iconAbout from "../../assets/images/icon-about.png";

export default function MyPage() {
    const navigate = useNavigate();

    // 使用自定义hook管理用户状态
    const { user, loading, updateNickname, updateAvatar } = useUser();

    // 编辑弹窗状态
    const [editVisible, setEditVisible] = useState(false);
    const [formNickname, setFormNickname] = useState("");
    const [formAvatar, setFormAvatar] = useState<string>("");

    const avatarOptions = [
        avatar1,
        avatar2,
        avatar3,
        avatar4,
        avatar5,
        avatar6,
    ];

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div>加载中...</div>
            </div>
        );
    }

    // 打开编辑弹窗
    const handleOpenEdit = () => {
        setFormNickname(user.nickname);
        setFormAvatar(user.avatar);
        setEditVisible(true);
    };

    // 保存编辑
    const handleSaveProfile = async () => {
        const nickname = formNickname.trim();
        if (!nickname) {
            Toast.show("请输入昵称");
            return;
        }

        // 使用自定义hook更新用户信息（会自动保存到localStorage）
        updateNickname(nickname);
        updateAvatar(formAvatar || user.avatar);
        setEditVisible(false);
        Toast.show("保存中…");

        // 可在此调用后端接口（若后端不可用则静默失败）
        try {
            const {
                updateNickname: updateNicknameApi,
                updateAvatar: updateAvatarApi,
            } = await import("../../services/user.service");
            await Promise.allSettled([
                updateNicknameApi(nickname),
                updateAvatarApi(formAvatar || user.avatar),
            ]);
            Toast.show("资料已更新");
        } catch (e) {
            // 静默处理，保留本地状态
            console.error("更新用户信息失败:", e);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)",
                paddingBottom: "20px",
            }}
        >
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>我的</h2>
                <p style={{ fontSize: "14px", color: "#666" }}>
                    个人中心与设置
                </p>

                {/* 个人信息卡片 */}
                <div
                    style={{
                        border: "1px solid #d8f3dc",
                        borderRadius: "12px",
                        padding: "20px",
                        margin: "20px 0",
                        backgroundColor: "#f8fff7",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Image
                                src={user.avatar}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    marginRight: "12px",
                                }}
                                fit="cover"
                            />
                            <div>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        color: "#00a878",
                                    }}
                                >
                                    {user.nickname}
                                </div>
                                <div
                                    style={{ fontSize: "14px", color: "#666" }}
                                >
                                    {user.school}
                                </div>
                            </div>
                        </div>
                        <Button
                            size="small"
                            onClick={handleOpenEdit}
                            style={{ padding: "4px 8px" }}
                        >
                            <span style={{ fontSize: "16px" }}>✏️</span>
                        </Button>
                    </div>

                    {/* 数据统计卡片 —— 由后端提供，前端仅渲染 */}
                    <Space wrap style={{ marginTop: "20px" }}>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                textAlign: "center",
                                width: "50px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#00a878",
                                }}
                            >
                                {user.stats.totalRecords}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                                累计记录
                            </div>
                        </div>

                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                textAlign: "center",
                                width: "50px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#00a878",
                                }}
                            >
                                {user.stats.consecutiveDays}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                                连续记录
                            </div>
                        </div>

                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                textAlign: "center",
                                width: "50px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#00a878",
                                }}
                            >
                                Lv.{user.stats.treeLevel}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                                心情树
                            </div>
                        </div>
                    </Space>
                </div>

                {/* 「个人心情档案」和「关于我们」 */}
                <div style={{ textAlign: "left" }}>
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "12px",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                        }}
                        onClick={() => navigate("/record/history")}
                    >
                        <Space align="center">
                            <Image
                                src={iconArchive}
                                style={{ width: "24px", height: "24px" }}
                            />
                            <div>
                                <div style={{ fontWeight: "bold" }}>
                                    个人心情档案
                                </div>
                                <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                >
                                    查看所有记录
                                </div>
                            </div>
                        </Space>
                    </div>

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "16px",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                        }}
                        onClick={() => navigate("/about")}
                    >
                        <Space align="center">
                            <Image
                                src={iconAbout}
                                style={{ width: "24px", height: "24px" }}
                            />
                            <div>
                                <div style={{ fontWeight: "bold" }}>
                                    关于我们
                                </div>
                                <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                >
                                    版本信息与反馈
                                </div>
                            </div>
                        </Space>
                    </div>
                </div>
            </div>

            {/* 编辑资料弹窗 */}
            <CenterPopup
                visible={editVisible}
                onMaskClick={() => setEditVisible(false)}
                onClose={() => setEditVisible(false)}
                style={{
                    "--z-index": "1000",
                }}
                bodyStyle={{
                    width: "calc(100vw - 40px)",
                    maxWidth: "440px",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 12 }}>
                        编辑资料
                    </div>
                    <div
                        style={{
                            marginBottom: 10,
                            fontSize: 12,
                            color: "#666",
                        }}
                    >
                        昵称
                    </div>
                    <Input
                        value={formNickname}
                        onChange={(val) => setFormNickname(val)}
                        placeholder="请输入昵称"
                        maxLength={20}
                        style={{ marginBottom: 12 }}
                    />

                    <div
                        style={{
                            marginBottom: 10,
                            fontSize: 12,
                            color: "#666",
                        }}
                    >
                        头像
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            marginBottom: 16,
                        }}
                    >
                        {avatarOptions.map((src) => {
                            const active = formAvatar === src;
                            return (
                                <button
                                    key={src}
                                    onClick={() => setFormAvatar(src)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 8,
                                        border: active
                                            ? "2px solid #00a878"
                                            : "1px solid #e6e6e6",
                                        padding: 0,
                                        background: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Image
                                        src={src}
                                        style={{ width: 28, height: 28 }}
                                        fit="contain"
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <Button color="primary" block onClick={handleSaveProfile}>
                        保存
                    </Button>
                </div>
            </CenterPopup>
        </div>
    );
}
