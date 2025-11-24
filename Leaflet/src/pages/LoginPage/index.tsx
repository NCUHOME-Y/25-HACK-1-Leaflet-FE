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
      <style>{`
        .login-page-hero{width:100%;max-width:430px;margin:0 auto;padding:60px 20px;box-sizing:border-box;text-align:center;border-radius:0;}
        .login-form{width:100%;max-width:420px;margin:0 auto;padding:24px;box-sizing:border-box;text-align:center}
        .login-input{width:100%}
        .login-buttons{margin-top:48px}
        /* make buttons sit side-by-side on desktop and stacked on mobile */
        .login-buttons{display:flex;gap:12px;justify-content:center}
        .login-buttons .ant-btn{width:48%;min-width:120px}
        @media (max-width:480px){
          .login-page-hero{padding:32px 12px}
          .login-page-hero img{width:96px;height:96px}
          .login-page-hero h1{font-size:20px;margin:8px 0}
          .login-page-hero h2{font-size:14px;margin:0}
          .login-form{padding:16px;padding-bottom:120px}
          .login-input{width:100%}
          .login-buttons{margin-top:24px;flex-direction:column}
          .login-buttons .ant-btn{width:100%;min-width:0}
          /* ensure buttons are always reachable on small screens: sticky to bottom */
          .login-buttons.sticky-mobile{position:fixed;left:50%;transform:translateX(-50%);bottom:env(safe-area-inset-bottom,12px);width:calc(100% - 24px);max-width:420px;padding:10px 12px;z-index:9999;background:rgba(255,255,255,0.92);border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12)}
          .login-buttons.sticky-mobile .ant-btn{width:48%;min-width:0}
          .login-buttons.sticky-mobile .ant-btn:first-child{margin-right:8px}
        }
      `}</style>

      <div
        className="login-page-hero"
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
        className="login-form"
        style={{
          padding: "24px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 1)",
        }}
      >
        <Input
          className="login-input"
          placeholder="请输入用户名"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ maxWidth: 350, height: "50px", margin: "12px 0" }}
          onPressEnter={handleLogin}
        />
        <br />
        <Input.Password
          className="login-input"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ maxWidth: 350, height: 50, margin: "12px 0" }}
          onPressEnter={handleLogin}
        />
        <br />
        <Space
          className="login-buttons sticky-mobile"
          style={{ marginTop: 48 }}
        >
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
