import apiClient from "./apiClient";

export const publishAirplane = (content: string) => {
  return apiClient.post('/api/mind', { content });
};

export const pickAirplane = () => {
  return apiClient.get('/api/mind');
};

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
  return apiClient.get<{ used: number; limit: number }>('/api/airplane/daily-limit');
};
