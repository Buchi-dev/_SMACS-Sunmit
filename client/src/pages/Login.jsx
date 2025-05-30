import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, message, Radio, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      
      if (result.success) {
        // Navigate based on role
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/faculty/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          style={{ 
            width: 400, 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>SMACS Login</Title>
            <p style={{ color: 'rgba(0,0,0,0.45)' }}>Student Monitoring and Attendance Control System</p>
          </div>
          
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', height: '40px' }}
                size="large"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
            
            <div style={{ textAlign: 'center' }}>
              <p>
                Don't have an account? <Link to="/register">Register now!</Link>
              </p>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;