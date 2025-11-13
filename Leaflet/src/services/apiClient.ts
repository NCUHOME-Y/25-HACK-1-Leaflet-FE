// src/services/apiClient.ts
import axios from 'axios';
import { API_BASE_URL } from '../lib/constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器：自动加 token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 开发环境下打印请求信息，便于调试（不要在生产环境泄露 token）
  try {
    if (import.meta.env.DEV) {
      console.debug('[apiClient] request', {
        method: config.method,
        url: config.baseURL ? config.baseURL + config.url : config.url,
        headers: { ...(config.headers || {}) },
      });
    }
  } catch (e) {
    // ignore in environments without import.meta
  }
  return config;
});

// 响应拦截器：统一错误处理（简化）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 更详细的错误日志（开发环境）
    const errData = error.response?.data || error.message;
    console.error('API Error:', errData);
    try {
      if (import.meta.env.DEV) {
        console.debug('[apiClient] response error', {
          url: error.config?.url,
          status: error.response?.status,
          data: errData,
        });
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(error);
  }
);

export default apiClient;