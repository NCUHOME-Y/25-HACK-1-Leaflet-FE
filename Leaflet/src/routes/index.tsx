import { Navigate } from "react-router-dom";

// 页面组件
import LoginPage from "../pages/LoginPage";
import MoodRecordPage from "../pages/moodrecordPage";
import TreePage from "../pages/TreePage";
import AirplaneWritePage from "../pages/AirplaneWritePage";
import AirplanePickPage from "../pages/AirplanePickPage";
import EncouragementPage from "../pages/EncouragementPage";

// === 方案1：【推荐】游客模式兜底，登录可选（适合 P0 快速交付） ===
// 所有页面都允许游客访问，用 mock token 绕过鉴权
// 后期补登录时再启用 ProtectedRoute

export const routes = [
    // 登录页（游客可跳过）
    {
        path: "/",
        element: <LoginPage />,
        name: "登录",
    },
    // 心情记录（P0 核心）
    {
        path: "/record",
        element: <MoodRecordPage />,
        name: "心情记录",
    },
    // 心情树主页（P0 核心入口）
    {
        path: "/tree",
        element: <TreePage />,
        name: "心情树",
    },
    // 写纸折纸（P0）
    {
        path: "/airplane/write",
        element: <AirplaneWritePage />,
        name: "写纸折纸",
    },
    // 捞取纸飞机（P0）
    {
        path: "/airplane/pick",
        element: <AirplanePickPage />,
        name: "捞取纸飞机",
    },
    // 鼓励语
    {
        path: "/encouragement",
        element: <EncouragementPage />,
        name: "每日鼓励",
    },
    // 兜底重定向
    {
        path: "*",
        element: <Navigate to="/" replace />,
        name: "重定向",
    },
];

export default routes;
