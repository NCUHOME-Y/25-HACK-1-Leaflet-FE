import apiClient from "./apiClient";

// 匿名纸飞机模块 - 根据后端接口文档

// POST /mind - 上传情绪（发送纸飞机）
export const publishAirplane = (context: string) => {
    return apiClient.post("/mind", { context });
};

// GET /mind - 获取情绪匹配（旧接口，建议使用 getSolve）
// 返回一个规范化对象：{ raw, content, comfort, status }
export const pickAirplane = async () => {
    const res = await apiClient.get("/mind");
    const body = res.data;
    // 兼容多种后端返回格式：string / { content } / { context } / { data: { content } }
    const content =
        typeof body === "string"
            ? body
            : body?.content ??
              body?.context ??
              body?.data?.content ??
              body?.data?.context ??
              null;
    const comfort = body?.comfort ?? body?.data?.comfort ?? null;
    // 兼容旧的页面检查字段：message / limitExceeded / exceed
    const message = body?.message ?? null;
    const limitExceeded = Boolean(
        body?.limitExceeded ||
            body?.exceed ||
            (typeof message === "string" &&
                (message.includes("超出") || message.includes("限制")))
    );
    const exceed = Boolean(body?.exceed || body?.limitExceeded);

    return {
        raw: body,
        content,
        comfort,
        status: res.status,
        // 保留向后兼容字段，方便页面不改动即可使用
        message,
        limitExceeded,
        exceed,
    };
};

// GET /solve - 获取情绪疏导（摘取纸飞机，包含次数限制检查）
export const getSolve = () => {
    return apiClient.get("/solve");
};

// POST /solve - 上传情绪疏导（回复纸飞机）
// export const replyToAirplane = (content: string) => {
//     return apiClient.post("/solve", { content });
// };

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
    return apiClient.get("/api/mind/daily-limit");
};

// POST /solve/:id 用户提供解决方案
export const replyToAirplane = (id: number, solution: string) => {
    return apiClient.post(`/solve/${id}`, { solution });
};
