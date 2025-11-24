import apiClient from './apiClient';

// 简化接口，只传递后端需要的字段
export interface MindRecordPayload {
  tag_id: number;  // 标签ID (1,2,3,4等)
  content: string; // 内容
}

// 后端返回的记录数据格式
export interface MindRecord {
  tag_id: number;           // 标签ID
  content: string;          // 内容
  all_record_count: number; // 该标签下的总记录数
  created_at?: string;      // 创建时间
  id?: string | number;     // 记录ID
}

// 用户等级信息
export interface UserLevel {
  level: number;        // 用户等级
  record_days: number;  // 记录天数
}

// 获取用户等级信息
export const getUserLevel = () => {
  return apiClient.get('/status/level');
};

// 记录心情 - 只发送 tag_id 和 content
export const recordMind = (data: MindRecordPayload) => {
  const payload = {
    tag_id: data.tag_id,
    content: data.content
  };

  return apiClient.post('/status', payload);
};

// 获取特定场景的记录
export const getSceneRecords = (sceneKey: string) => {
  // 修正路径格式，后端通常使用 /status/:sceneKey
  return apiClient.get(`/status/${sceneKey}`);
};

// 获取所有心情记录（按时间降序）
export const getAllRecords = () => {
  return apiClient.get(`/status/mine`);
};

// 删除心情记录
export const deleteRecord = (id: number | string) => {
  return apiClient.delete(`/status/${id}`);
};

// 编辑心情记录
export const updateRecord = (id: number | string, data: { tag_id: number; content: string }) => {
  return apiClient.put(`/status/${id}`, data);
};

// 场景相关的统计与上报在单独的 scene.service.ts 中实现，保持向后兼容的同时便于职责分离
export { getSceneStats, getTagCount, updateSceneClick } from './scene.service';