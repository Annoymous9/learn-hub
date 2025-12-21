import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useUserStore } from '@/stores/userStore';
import { login as apiLogin } from '@/api/client';

const { Title, Text } = Typography;

interface LoginFormValues {
    username: string;
    password: string;
}

/**
 * 登录页面组件
 */
const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUserStore();

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const response = await apiLogin(values.username, values.password);

            // 存储用户信息和 Token
            login(response.user, response.access_token, response.refresh_token);

            message.success('登录成功！');
            navigate('/notes');
        } catch (error: any) {
            message.error(error?.message || '登录失败，请检查用户名和密码');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 420,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    borderRadius: 16,
                    padding: '20px 12px',
                }}
                bordered={false}
            >
                <Space direction="vertical" size="large" style={{ width: '100%', display: 'flex' }}>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <Title level={2} style={{ marginBottom: 8, color: '#1890ff', fontWeight: 600 }}>
                            LearnHub
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>个人学习平台</Text>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        size="large"
                        requiredMark={false}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="用户名"
                                autoComplete="username"
                                style={{ height: 48, fontSize: 16 }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                            style={{ marginBottom: 24 }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="密码"
                                autoComplete="current-password"
                                style={{ height: 48, fontSize: 16 }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderRadius: 8,
                                }}
                            >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;
