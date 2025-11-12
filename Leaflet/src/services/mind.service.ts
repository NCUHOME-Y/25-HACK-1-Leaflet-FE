import apiClient from './apiClient';

export interface MindRecord {
  id?: string;
  scene: string;
  sceneKey: string;
  content: string;
  timestamp?: string;
}

// 记录心情
export const recordMind = (data: MindRecord) => {
  // 统一使用 /api 前缀的 mind 接口
  return apiClient.post('/api/mind/record', data);
};

// 获取特定场景的记录
export const getSceneRecords = (sceneKey: string) => {
  return apiClient.get(`/api/mind/records/${sceneKey}`);
};

// 获取所有心情记录（按时间降序）
export const getAllRecords = () => {
  return apiClient.get(`/api/mind/records`);
};

// 场景相关的统计与上报在单独的 scene.service.ts 中实现，保持向后兼容的同时便于职责分离
export { getSceneStats, getSceneStatsByKey, updateSceneClick } from './scene.service';