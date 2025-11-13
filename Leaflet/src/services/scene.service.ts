import apiClient from './apiClient';

/**
 * 获取所有场景的统计信息
 * 返回示例（取决于后端实现）：
 * - [{ sceneKey: string, count: number }, ...]
 * - { [sceneKey]: count, ... }
 */
export const getSceneStats = () => {
    return apiClient.get('/api/mind/stats');
};

/**
 * 如果后端支持按场景查询，可使用此接口（可选）
 */
export const getSceneStatsByKey = (sceneKey: string) => {
    return apiClient.get(`/status/by_tag/3/${sceneKey}`);
};

/**
 * 上报场景被点击/打开（用于统计或热度） 
 */
export const updateSceneClick = (sceneKey: string) => {
    return apiClient.post(`/api/mind/click/${sceneKey}`);
};
