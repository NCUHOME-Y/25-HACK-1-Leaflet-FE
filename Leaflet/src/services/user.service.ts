import apiClient from './apiClient';

// 获取用户完整信息（含统计）
export const getUserProfile = () => {
  return apiClient.get('/api/user/profile');
};

// 修改昵称
export const updateNickname = (nickname: string) => {
  return apiClient.patch('/api/user/nickname', { nickname });
};