import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Layout as AntLayout,
    Menu,
    theme,
    Avatar,
    Dropdown,
    Button,
    Space,
} from 'antd';
import type { MenuProps } from 'antd';
import {
    BookOutlined,
    FileTextOutlined,
    FormOutlined,
    CalendarOutlined,
    DashboardOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@/stores/userStore';

const { Header, Sider, Content } = AntLayout;

// 侧边栏菜单项配置
const menuItems: MenuProps['items'] = [
    {
        key: '/notes',
        icon: <FileTextOutlined />,
        label: '笔记管理',
    },
    {
        key: '/notebooks',
        icon: <BookOutlined />,
        label: '笔记本',
    },
    {
        key: '/exams',
        icon: <FormOutlined />,
        label: '题库与考试',
    },
    {
        key: '/tasks',
        icon: <CalendarOutlined />,
        label: '日程待办',
    },
    {
        key: '/monitor',
        icon: <DashboardOutlined />,
        label: '网站监控',
    },
    {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
    },
];

/**
 * 主布局组件
 * 提供侧边栏导航、顶部栏和内容区域
 */
const Layout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const { user, logout } = useUserStore();

    // 用户下拉菜单
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人信息',
            onClick: () => navigate('/profile'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];

    // 处理菜单点击
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            {/* 侧边栏 */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: token.colorBgContainer,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                {/* Logo 区域 */}
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    }}
                >
                    <span
                        style={{
                            fontSize: collapsed ? 20 : 24,
                            fontWeight: 'bold',
                            color: token.colorPrimary,
                            transition: 'all 0.3s',
                        }}
                    >
                        {collapsed ? 'LH' : 'LearnHub'}
                    </span>
                </div>

                {/* 导航菜单 */}
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            <AntLayout>
                {/* 顶部栏 */}
                <Header
                    style={{
                        padding: '0 24px',
                        background: token.colorBgContainer,
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* 折叠按钮 */}
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16 }}
                    />

                    {/* 用户信息 */}
                    <Space>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar
                                    style={{ backgroundColor: token.colorPrimary }}
                                    icon={<UserOutlined />}
                                />
                                <span>{user?.username || '未登录'}</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                {/* 内容区域 */}
                <Content
                    style={{
                        margin: 24,
                        padding: 24,
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        minHeight: 280,
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;
