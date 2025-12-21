import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, useUserStore } from '@/stores/userStore';

// API 基础配置
const API_BASE_URL = '/api';

// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：注入 JWT Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理错误和 Token 刷新
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // 处理 401 未授权错误
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 尝试刷新 Token
                const refreshToken = useUserStore.getState().refreshToken;
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token } = response.data;
                    useUserStore.getState().setTokens(access_token, refreshToken);

                    // 重试原请求
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // 刷新失败，登出用户
                useUserStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // 提取错误信息
        const errorMessage =
            (error.response?.data as any)?.error?.message ||
            error.message ||
            '请求失败';

        return Promise.reject(new Error(errorMessage));
    }
);

// ============ API 接口定义 ============

// 登录响应类型
interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
        id: number;
        username: string;
        email: string | null;
        role: 'admin' | 'user';
        status: number;
        created_at: string;
        last_login_at: string | null;
    };
}

/**
 * 用户登录
 */
export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
    });
    return response.data;
};

/**
 * 刷新 Token
 */
export const refreshToken = async (
    refresh_token: string
): Promise<{ access_token: string; expires_in: number }> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token });
    return response.data;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
    const response = await apiClient.get('/users/me');
    return response.data.data;
};

export default apiClient;
