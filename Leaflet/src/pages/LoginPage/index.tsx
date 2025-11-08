import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, message, Space } from 'antd';
import { login, register } from '../../services/auth.service';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    if (!id.trim() || !password) return message.warning('请输入你的用户ID和密码');
    setLoading(true);
    try {
      await login(id, password);
      message.success('登录成功！正在跳转...');
      setTimeout(() => {
        // 检查是否有重定向路径，如果没有则默认跳转到 /record
        const from = (location.state as any)?.from?.pathname || '/record';
        navigate(from, { replace: true });
      }, 800); // 0.8秒后跳转
    } catch {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!id.trim() || !password) return message.warning('请输入你的用户ID和密码');
    setLoading(true);
    try {
      await register(id, password);
      message.success('注册成功！正在跳转...');
      setTimeout(() => {
        navigate('/record', { replace: true });
      }, 800); // 0.8秒后跳转
    } catch {
      message.error('注册失败，请重试');
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