import apiClient from './apiClient';

// 登录接口
export const login = async (username: string, password: string) => {
  try {
    // 调用后端的 login 接口
    const res = await apiClient.post('/login', { username, password });
    // 假设后端返回格式是 { token: "xxx" }
    const token = res.data?.token;
    // 如果后端没有返回 token，则视为失败并抛出错误，避免存入 undefined
    if (!token) {
      console.warn('Login succeeded but no token returned:', res.data);
      throw new Error('登录失败：未收到登录凭证');
    }
    localStorage.setItem('token', token);
    return res.data; // 返回数据给调用方
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // 把错误抛出去，让 handleLogin 的 catch 捕获
  }
};

// 注册接口
export const register = async (username: string, password: string) => {
  try {
    // 调用后端的 register 接口
    const res = await apiClient.post('/register', { username, password });
    // 假设后端返回格式是 { token: "xxx" }
    const token = res.data?.token;
    // 如果后端没有返回 token，则视为失败并抛出错误，避免存入 undefined
    if (!token) {
      console.warn('Register succeeded but no token returned:', res.data);
      throw new Error('注册失败：未收到登录凭证');
    }
    localStorage.setItem('token', token);
    return res.data; // 返回数据给调用方
  } catch (error) {
    console.error('Register failed:', error);
    throw error; // 把错误抛出去
  }
};