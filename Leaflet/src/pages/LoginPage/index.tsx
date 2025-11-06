import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { login } from '../../services/auth.service';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id.trim() || !password) return message.warning('请输入你的用户ID和密码');
    setLoading(true);
    try {
      await login(id, password);
      message.success('登录成功！正在跳转...');
      setTimeout(() => {
        window.location.href = '/record';
      }, 800); // 1秒后跳转
      // 临时：后续可改用路由导航（useNavigate）以避免整页刷新
    } catch {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🌿 Leaflet 登录</h2>
      <p>输入你的用户ID即可快速进入</p>
      <Input
        placeholder="请输入ID"
        value={id}
        onChange={e => setId(e.target.value)}
        style={{ width: '200px', margin: '16px' }}
        onPressEnter={handleLogin}
      />
      <br />
      <Input.Password
        placeholder="请输入密码"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '200px', margin: '8px' }}
        onPressEnter={handleLogin}
      />
      <br />
      <Button type="primary" loading={loading} onClick={handleLogin}>
        进入 MindWood
      </Button>
    </div>
  );
}