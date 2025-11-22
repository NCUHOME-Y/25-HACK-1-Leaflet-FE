import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Space } from "antd";
import { login, register } from "../../services/auth.service";
import icon from "../../assets/images/icon.png";

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
      // ID已存在：给出 alert 明确提示，并终止兜底登录
      if (
        status === 409 &&
        typeof msg === "string" &&
        msg.includes("用户名已存在")
      ) {
        window.alert("ID已存在，请更换一个ID再试");
        message.warning("ID已存在");
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
    <>
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "rgba(197, 227, 220, 1)",
        }}
      >
        <img
          src={icon}
          alt="Leaflet icon"
          style={{
            width: 135,
            height: 135,
            border: "2px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            padding: 8,
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        />
        <h1>一页倾心</h1>
        <h2>Leaflet</h2>
      </div>

      <div
        style={{
          padding: "24px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 1)",
        }}
      >
        <Input
          placeholder="请输入用户名"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ width: "350px", height: "50px", margin: "12px 0" }}
          onPressEnter={handleLogin}
        />
        <br />
        <Input.Password
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: 350, height: 50, margin: "12px 0" }}
          onPressEnter={handleLogin}
        />
        <br />
        <Space style={{ marginTop: 48 }}>
          <Button type="primary" loading={loading} onClick={handleLogin}>
            登录
          </Button>
          <Button loading={loading} onClick={handleRegister}>
            注册
          </Button>
        </Space>
        <p>忘记密码？请联系管理员进行修改</p>
      </div>
    </>
  );
}
