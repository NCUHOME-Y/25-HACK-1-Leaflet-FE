import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Space } from "antd";
import { login, register } from "../../services/auth.service";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        if (!id.trim() || !password)
            return message.warning("请输入你的用户ID和密码");
        setLoading(true);
        try {
            await login(id, password);
            message.success("登录成功！");
            // 直接跳转，删除延时
            const from = (location.state as any)?.from?.pathname || "/record";
            navigate(from, { replace: true });
        } catch {
            message.error("登录失败，请重试");
        } finally {
            setLoading(false);
        }
        if ((window as any).umami) {
            (window as any).umami.track("登录");
        } else {
            window.addEventListener(
                "umami:ready",
                () => {
                    (window as any).umami?.track("登录");
                },
                { once: true }
            );
        }
    };

    const handleRegister = async () => {
        if (!id.trim() || !password)
            return message.warning("请输入你的用户ID和密码");
        setLoading(true);
        try {
            await register(id, password);
            // 确保有登录态：若注册未返回 token，则自动登录一次
            const hasToken = !!localStorage.getItem("token");
            if (!hasToken) {
                await login(id, password);
            }
            navigate("/record", { replace: true });
        } catch (e: any) {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message || e?.message;
            // 用户名已存在：给出 alert 明确提示，并终止兜底登录
            if (
                status === 409 &&
                typeof msg === "string" &&
                msg.includes("用户名已存在")
            ) {
                window.alert("用户名已存在，请更换一个用户ID再试");
                message.warning("用户名已存在");
                return;
            }
            // 其它情况：注册失败时尝试直接登录（有些后端注册成功但不返回 token）
            try {
                await login(id, password);
                navigate("/record", { replace: true });
                return;
            } catch (e2: any) {
                message.error(e2?.message || msg || "注册失败，请重试");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>🌿 Leaflet 登录</h2>
            <p>输入用户名和密码注册后即可登录</p>
            <Input
                placeholder="请输入ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{ width: "200px", margin: "16px" }}
                onPressEnter={handleLogin}
            />
            <br />
            <Input.Password
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "200px", margin: "8px" }}
                onPressEnter={handleLogin}
            />
            <br />
            <Space>
                <Button type="primary" loading={loading} onClick={handleLogin}>
                    登录
                </Button>
                <Button loading={loading} onClick={handleRegister}>
                    注册
                </Button>
            </Space>
        </div>
    );
}
