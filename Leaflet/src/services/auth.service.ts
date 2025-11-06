import apiClient from './apiClient';

export const login = async (username: string, password: string) => {
  try {
    // 将 id 与 password 一并发送到后端
    const res = await apiClient.post('/register', { username, password });
    // 假设后端返回格式是 { token: "xxx" }
    const token = res.data.token;
    localStorage.setItem('token', token);
    return res.data; // 返回数据给调用方
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // 把错误抛出去，让 handleLogin 的 catch 捕获
  }
};