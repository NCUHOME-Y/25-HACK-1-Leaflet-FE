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
 * 获取指定标签的人数统计
 * @param tagId 标签ID (1-9)
 * @returns { count: number }
 */
export const getTagCount = (tagId: number) => {
    return apiClient.get(`/status/by_tag/${tagId}`);
};

/**
 * 上报场景被点击/打开（用于统计或热度） 
 */
export const updateSceneClick = (sceneKey: string) => {
    return apiClient.post(`/api/mind/click/${sceneKey}`);
};
