import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, message, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('faculty');

  const onFinish = (values) => {
    console.log('Login form values:', values);
    
    // Simple validation for demo purposes
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('Admin login successful!');
      onLogin('admin');
      navigate('/dashboard');
    } else if (values.username === 'faculty' && values.password === 'faculty') {
      message.success('Faculty login successful!');
      onLogin('faculty');
      navigate('/dashboard');
    } else {
      // For demo, also allow any credentials with selected role
      message.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
      onLogin(role);
      navigate('/dashboard');
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

            <Form.Item name="role">
              <Radio.Group onChange={(e) => setRole(e.target.value)} value={role}>
                <Radio value="admin">Admin</Radio>
                <Radio value="faculty">Faculty</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', height: '40px' }}
                size="large"
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