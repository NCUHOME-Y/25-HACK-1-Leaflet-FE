// src/services/encouragement.service.ts
import apiClient from "./apiClient";

// 后端接口：GET /api/encouragements
export const getTodayEncouragement = () => {
  return apiClient.get('/encouragements');
};

/**
 * 只返回鼓励语文本（message 字段）的便捷方法。
 * 兼容后端可能返回的几种结构：
 * - { encouragement: { message: '...' } }
 * - [{ encouragement: { message: '...' } }]
 * - { message: '...' }
 */
export const getEncouragementMessage = async (): Promise<string> => {
  const resp = await apiClient.get('/encouragements');
  const data = resp.data;

  // case: { encouragement: { message: '...' } }
  if (data && typeof data === 'object' && data.encouragement && data.encouragement.message) {
    return data.encouragement.message;
  }

  // case: array like [{ encouragement: { message: '...' } }]
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first && first.encouragement && first.encouragement.message) {
      return first.encouragement.message;
    }
    // sometimes backend might return array of messages
    if (typeof first === 'string') return first;
  }

  // case: { message: '...' }
  if (data && typeof data === 'object' && data.message) {
    return data.message;
  }

  // fallback: try to stringify but throw to indicate unexpected format
  throw new Error('无法从接口响应中解析出 message 字段');
};
