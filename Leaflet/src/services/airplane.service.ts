import apiClient from './apiClient';

export const publishAirplane = (content: string) => {
  return apiClient.post('/api/airplane', { content });
};

export const pickAirplane = () => {
  return apiClient.get('/api/airplane');
};

export const getDailyLimit = () => {
  return apiClient.get('/api/airplane/daily-limit');
};   