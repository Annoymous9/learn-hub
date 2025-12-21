import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from '@/components/Layout';
import LoginPage from '@/features/auth/LoginPage';
import { useUserStore } from '@/stores/userStore';

// 占位页面组件
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: 24 }}>
    <h1>{title}</h1>
    <p>此功能正在开发中...</p>
  </div>
);

// 路由守卫：需要登录
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 路由守卫：已登录跳转
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return <>{children}</>;
};

/**
 * 应用入口组件
 * 配置 Ant Design 主题和 React Router
 */
const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            {/* 公开路由 */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* 受保护路由 */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/notes" replace />} />
              <Route path="notes" element={<PlaceholderPage title="笔记管理" />} />
              <Route path="notebooks" element={<PlaceholderPage title="笔记本" />} />
              <Route path="exams" element={<PlaceholderPage title="题库与考试" />} />
              <Route path="tasks" element={<PlaceholderPage title="日程待办" />} />
              <Route path="monitor" element={<PlaceholderPage title="网站监控" />} />
              <Route path="settings" element={<PlaceholderPage title="系统设置" />} />
              <Route path="profile" element={<PlaceholderPage title="个人信息" />} />
            </Route>

            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;

