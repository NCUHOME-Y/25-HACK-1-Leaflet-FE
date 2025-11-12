import apiClient from "./apiClient";

  // 统一使用 /api 前缀的飞机相关接口
export const publishAirplane = (context: string) => {
    return apiClient.post("/api/airplane/publish", { context });
};

export const pickAirplane = () => {
    return apiClient.get("/api/airplane/pick");
};

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
    return apiClient.get("/api/mind/daily-limit");
};
