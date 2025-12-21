import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 用户信息类型
export interface User {
    id: number;
    username: string;
    email: string | null;
    role: 'admin' | 'user';
    status: number;
    created_at: string;
    last_login_at: string | null;
}

// 认证状态类型
interface AuthState {
    // 状态
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // 操作
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

/**
 * 用户状态存储
 * 使用 Zustand 管理用户认证状态，支持持久化存储
 */
export const useUserStore = create<AuthState>()(
    persist(
        (set) => ({
            // 初始状态
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            // 设置用户信息
            setUser: (user: User) =>
                set({
                    user,
                    isAuthenticated: true,
                }),

            // 设置 Token
            setTokens: (accessToken: string, refreshToken: string) =>
                set({
                    accessToken,
                    refreshToken,
                }),

            // 登录
            login: (user: User, accessToken: string, refreshToken: string) =>
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                }),

            // 登出
            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                }),

            // 更新用户信息
            updateUser: (userData: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'learnhub-auth', // localStorage 中的 key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // 只持久化这些字段
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

/**
 * 获取当前 Access Token
 * 用于 API 请求中注入 Authorization header
 */
export const getAccessToken = (): string | null => {
    return useUserStore.getState().accessToken;
};

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
    return useUserStore.getState().isAuthenticated;
};
