// src/services/encouragement.service.ts
import apiClient from "./apiClient";

// 后端接口：GET /api/encouragements
export const getTodayEncouragement = () => {
    return apiClient.get("/api/encouragements");
};
