import { useState, useEffect } from "react";
import avatar1 from "../../assets/images/avatar/avatar-1.png";
import { getUserLevel, getAllRecords } from "../../services/mind.service";

// 用户信息类型定义
export interface UserStats {
    totalRecords: number;
    consecutiveDays: number;
    treeLevel: number;
}

export interface User {
    id: string;
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
            const user = JSON.parse(stored);
            // 从 localStorage 读取登录时保存的用户名
            const username = localStorage.getItem('username');
            if (username && user.nickname === "NCU心情小伙伴") {
                // 如果有登录用户名且当前是默认昵称，则使用用户名
                user.nickname = username;
            }
            return user;
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
    }

    // 尝试从 localStorage 获取用户名
    const username = localStorage.getItem('username');
    
    // 默认用户信息
    const defaultUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nickname: username || "NCU心情小伙伴",
        avatar: avatar1,
        school: "南昌大学",
        stats: {
            totalRecords: 0,
            consecutiveDays: 0,
            treeLevel: 1,
        },
    };
    // 保存默认用户信息
    saveUserToStorage(defaultUser);
    return defaultUser;
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

    // 初始化时从localStorage加载用户信息，并从后端获取统计数据
    useEffect(() => {
        const storedUser = getUserFromStorage();
        setUser(storedUser);
        
        console.log('🚀 开始获取用户统计数据...');
        
        // 同时获取等级和记录数据
        Promise.all([
            getUserLevel()
                .then(res => {
                    console.log('✅ getUserLevel 成功');
                    return res;
                })
                .catch(err => {
                    console.error('❌ 获取用户等级失败:', err);
                    return null;
                }),
            getAllRecords()
                .then(res => {
                    console.log('✅ getAllRecords 成功');
                    return res;
                })
                .catch(err => {
                    console.error('❌ 获取记录列表失败:', err);
                    return null;
                })
        ])
        .then(([levelRes, recordsRes]) => {
            console.log('等级数据:', levelRes?.data);
            console.log('记录数据:', recordsRes?.data);
            
            let treeLevel = storedUser.stats.treeLevel;
            let totalRecords = storedUser.stats.totalRecords;
            let consecutiveDays = storedUser.stats.consecutiveDays;
            
            // 解析等级数据
            if (levelRes?.data) {
                treeLevel = levelRes.data.level || treeLevel;
                console.log('心情树等级 (level):', treeLevel);
            }
            
            // 解析记录统计数据 - GET /status/mine 返回 { "status": [...] }
            if (recordsRes?.data) {
                const data = recordsRes.data;
                console.log('统计数据对象:', data);
                
                // 从 status 数组中获取第一条记录的统计信息
                let records = data.status || data.records || data.data || [];
                console.log('记录数组:', records);
                
                if (Array.isArray(records) && records.length > 0) {
                    const firstRecord = records[0];
                    console.log('第一条记录:', firstRecord);
                    
                    // all_record_count - 总记录数
                    if (firstRecord.all_record_count !== undefined) {
                        totalRecords = firstRecord.all_record_count;
                        console.log('总记录数 (all_record_count):', totalRecords);
                    }
                    
                    // count - 连续记录天数
                    if (firstRecord.count !== undefined) {
                        consecutiveDays = firstRecord.count;
                        console.log('连续记录天数 (count):', consecutiveDays);
                    }
                }
            }
            
            console.log('最终统计数据:', { totalRecords, consecutiveDays, treeLevel });
            
            // 更新用户统计信息
            const updatedUser = {
                ...storedUser,
                stats: {
                    totalRecords,
                    consecutiveDays,
                    treeLevel,
                }
            };
            setUser(updatedUser);
            saveUserToStorage(updatedUser);
        })
        .finally(() => {
            setLoading(false);
        });
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
