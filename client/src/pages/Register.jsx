import React from 'react';
import { Form, Input, Button, Card, Typography, Layout, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Registration form values:', values);
    // Mock registration - replace with actual API call
    message.success('Registration successful! Please login with your credentials.');
    navigate('/login');
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          style={{ 
            width: 500, 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>SMACS Registration</Title>
            <p style={{ color: 'rgba(0,0,0,0.45)' }}>Student Monitoring and Attendance Control System</p>
          </div>
          
          <Form
            name="register_form"
            initialValues={{ role: 'faculty' }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Full Name" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Phone Number" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select size="large">
                <Option value="faculty">Faculty</Option>
                <Option value="staff">Staff</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
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
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="confirm"
              label="Confirm Password"
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
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', height: '40px' }}
                size="large"
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