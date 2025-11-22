import apiClient from "./apiClient";

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
export const getSolve = (params?: Record<string, any>) => {
  return apiClient.get("/solve", { params });
};

// 仅获取“与当前用户相关”的回信（需要后端支持）
export const getMySolves = () => {
  return getSolve({ mine: 1 }); // 后端可按 token 识别用户，仅返回属于我的回信
};

// 获取当日纸飞机使用情况（已使用 / 限额）
export const getDailyLimit = () => {
  return apiClient.get("/api/mind/daily-limit");
};

// POST /solve/:id 用户提供解决方案
export const replyToAirplane = (id: number, solution: string) => {
  return apiClient.post(`/solve/${id}`, { solution });
};

// 通过问题ID获取原问题内容（若后端支持 /mind/:id）
// 使用 /problems 接口获取问题数据（后端返回可能是数组或单项）
// 通过问题ID获取原问题内容（后端提供 GET /mind/:id）
export const getProblemById = (id: number | string) => {
  return apiClient.get(`/mind/${id}`);
};
