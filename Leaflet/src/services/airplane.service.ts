import apiClient from "./apiClient";

export const publishAirplane = (context: string) => {
    return apiClient.post("/mind", { context });
};

export const pickAirplane = () => {
    return apiClient.get("/mind");
};

export const getDailyLimit = () => {
    return apiClient.get("/api/mind/daily-limit");
};
