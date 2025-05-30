import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Prepare data for registration
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role || 'faculty',
        name: values.name,
        phone: values.phone,
        department: values.department
      };
      
      const result = await register(userData);
      
      if (result.success) {
        message.success('Registration successful! Redirecting to dashboard...');
        // Navigate based on role
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/faculty/dashboard');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Department options
  const departments = [
    'Mathematics',
    'Physics',
    'Computer Science',
    'Chemistry',
    'English',
    'History',
    'General'
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
        <Card 
          style={{ 
            width: 500, 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Register</Title>
            <p style={{ color: 'rgba(0,0,0,0.45)' }}>Create your SMACS account</p>
          </div>
          
          <Form
            name="register_form"
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
              />
            </Form.Item>
            
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Full Name" 
              />
            </Form.Item>
            
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Phone Number" 
              />
            </Form.Item>
            
            <Form.Item
              name="department"
              rules={[{ required: true, message: 'Please select your department!' }]}
            >
              <Select placeholder="Select Department">
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="role"
              initialValue="faculty"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select placeholder="Select Role">
                <Option value="faculty">Faculty</Option>
                <Option value="admin">Administrator</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%' }}
                size="large"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>
            
            <div style={{ textAlign: 'center' }}>
              <p>
                Already have an account? <Link to="/login">Login now!</Link>
              </p>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;