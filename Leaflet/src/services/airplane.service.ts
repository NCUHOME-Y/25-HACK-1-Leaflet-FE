import apiClient from "./apiClient";

export const publishAirplane = (context: string) => {
    return apiClient.post("/mind", { context });
};

export const pickAirplane = () => {
    return apiClient.get("/mind");
};

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
    return apiClient.get("/api/mind/daily-limit");
};
