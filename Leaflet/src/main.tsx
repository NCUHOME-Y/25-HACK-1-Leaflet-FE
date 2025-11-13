import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import "./styles/globals.css";

// 为 antd-mobile 兼容 React 19 添加 polyfill
(ReactDOM as any).unmountComponentAtNode = (container: Element | null) => {
    if (container) {
        container.remove();
    }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
