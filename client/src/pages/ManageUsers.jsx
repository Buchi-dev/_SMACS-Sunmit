import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Popconfirm, 
  message,
  Card,
  Divider,
  Tag
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined 
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const ManageUsers = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@smacs.edu', role: 'admin', status: 'active' },
    { id: 2, username: 'faculty1', email: 'faculty1@smacs.edu', role: 'faculty', status: 'active' },
    { id: 3, username: 'faculty2', email: 'faculty2@smacs.edu', role: 'faculty', status: 'inactive' },
    { id: 4, username: 'staff1', email: 'staff1@smacs.edu', role: 'staff', status: 'active' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('User updated successfully!');
      } else {
        // Create new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
        };
        setUsers([...users, newUser]);
        message.success('User created successfully!');
      }
      setIsModalVisible(false);
      setLoading(false);
      form.resetFields();
    }, 500);
  };

  const handleDelete = (userId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userId));
      message.success('User deleted successfully!');
      setLoading(false);
    }, 500);
  };

  const handleStatusChange = (userId, newStatus) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      message.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        if (role === 'admin') color = 'red';
        if (role === 'faculty') color = 'green';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'active' ? 'green' : 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          />
          {record.status === 'active' ? (
            <Button 
              icon={<LockOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record.id, 'inactive')}
            />
          ) : (
            <Button 
              icon={<UnlockOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record.id, 'active')}
            />
          )}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Manage Users</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={() => showModal()}
        >
          Add User
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="faculty">Faculty</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="active"
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          
          <Divider />
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;