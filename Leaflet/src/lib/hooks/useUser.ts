import { useState, useEffect } from "react";
import avatar1 from "../../assets/images/avatar/avatar-1.png";

// 用户信息类型定义
export interface UserStats {
    totalRecords: number;
    consecutiveDays: number;
    treeLevel: number;
}

export interface User {
    nickname: string;
    avatar: string;
    school: string;
    stats: UserStats;
}

const STORAGE_KEY = "user_profile";

// 从localStorage获取用户信息
const getUserFromStorage = (): User => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
    }

    // 默认用户信息
    return {
        nickname: "NCU心情小伙伴",
        avatar: avatar1,
        school: "南昌大学",
        stats: {
            totalRecords: 0,
            consecutiveDays: 0,
            treeLevel: 1,
        },
    };
};

// 保存用户信息到localStorage
const saveUserToStorage = (user: User): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to localStorage:", error);
    }
};

export const useUser = () => {
    const [user, setUser] = useState<User>(getUserFromStorage);
    const [loading, setLoading] = useState(true);

    // 初始化时从localStorage加载用户信息
    useEffect(() => {
        const storedUser = getUserFromStorage();
        setUser(storedUser);
        setLoading(false);
    }, []);

    // 更新用户信息
    const updateUser = (updates: Partial<User>) => {
        const newUser = { ...user, ...updates };
        setUser(newUser);
        saveUserToStorage(newUser);
    };

    // 更新昵称
    const updateNickname = (nickname: string) => {
        updateUser({ nickname });
    };

    // 更新头像
    const updateAvatar = (avatar: string) => {
        updateUser({ avatar });
    };

    // 更新统计信息
    const updateStats = (stats: Partial<UserStats>) => {
        updateUser({ stats: { ...user.stats, ...stats } });
    };

    // 重置为默认用户信息
    const resetUser = () => {
        const defaultUser = getUserFromStorage();
        setUser(defaultUser);
        saveUserToStorage(defaultUser);
    };

    return {
        user,
        loading,
        updateUser,
        updateNickname,
        updateAvatar,
        updateStats,
        resetUser,
    };
};
