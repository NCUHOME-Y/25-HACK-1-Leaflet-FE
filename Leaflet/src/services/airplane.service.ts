import apiClient from "./apiClient";

// 匿名纸飞机模块 - 根据后端接口文档

// POST /mind - 上传情绪（发送纸飞机）
export const publishAirplane = (context: string) => {
    return apiClient.post("/mind", { context });
};

// GET /mind - 获取情绪匹配（旧接口，建议使用 getSolve）
export const pickAirplane = () => {
    return apiClient.get("/mind");
};

// GET /solve - 获取情绪疏导（摘取纸飞机，包含次数限制检查）
export const getSolve = () => {
    return apiClient.get("/solve");
};

// POST /solve - 上传情绪疏导（回复纸飞机）
export const replyToAirplane = (content: string) => {
    return apiClient.post("/solve", { content });
};

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
    return apiClient.get("/api/mind/daily-limit");
};
