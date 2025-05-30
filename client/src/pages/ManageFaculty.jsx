import React, { useState, useEffect } from 'react';
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
  Row, 
  Col,
  Tag,
  Avatar,
  Tooltip
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined
} from '@ant-design/icons';
import useFetch from '../hooks/useFetch';
import { 
  getAllFaculty, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty,
  registerFaculty
} from '../services/api';
import DataLoader from '../components/DataLoader';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageFaculty = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createAccountModalVisible, setCreateAccountModalVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [userForm] = Form.useForm();
  const [userFormLoading, setUserFormLoading] = useState(false);

  // Fetch faculty data
  const { 
    data: facultyData,
    loading: fetchLoading,
    error: fetchError,
    refetch: refetchFaculty
  } = useFetch(getAllFaculty, {
    initialParams: searchParams,
    dependencies: [searchParams]
  });

  // Extract faculty array from API response
  const faculty = facultyData?.data || [];

  useEffect(() => {
    if (fetchError) {
      message.error('Failed to fetch faculty: ' + fetchError);
    }
  }, [fetchError]);

  const showModal = (faculty = null) => {
    setEditingFaculty(faculty);
    setIsModalVisible(true);
    if (faculty) {
      form.setFieldsValue({
        employeeId: faculty.employeeId,
        name: faculty.name,
        email: faculty.email,
        phone: faculty.phone,
        department: faculty.department,
        qualification: faculty.qualification,
        joiningDate: faculty.joiningDate,
        subjects: faculty.subjects,
        status: faculty.status,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSearch = (values) => {
    setSearchParams(values);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    setSearchParams({});
  };

  const handleSave = async (values) => {
    try {
      setSubmitLoading(true);
      
      if (editingFaculty) {
        // Update existing faculty
        await updateFaculty(editingFaculty._id, values);
        message.success('Faculty updated successfully!');
      } else {
        // Create new faculty
        await createFaculty(values);
        message.success('Faculty added successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      refetchFaculty();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (facultyId) => {
    try {
      await deleteFaculty(facultyId);
      message.success('Faculty deleted successfully!');
      refetchFaculty();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Delete failed';
      message.error(errorMsg);
    }
  };

  const handleStatusChange = async (facultyId, newStatus) => {
    try {
      await updateFaculty(facultyId, { status: newStatus });
      message.success(`Faculty ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      refetchFaculty();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Status update failed';
      message.error(errorMsg);
    }
  };

  const handleCreateUserAccount = (faculty) => {
    setSelectedFaculty(faculty);
    userForm.setFieldsValue({
      username: faculty.employeeId,
      email: faculty.email,
      name: faculty.name,
      department: faculty.department,
      role: 'faculty'
    });
    setCreateAccountModalVisible(true);
  };

  const handleUserFormCancel = () => {
    setCreateAccountModalVisible(false);
    userForm.resetFields();
  };

  const handleUserFormSubmit = async (values) => {
    try {
      setUserFormLoading(true);
      
      // Prepare data for registration
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: 'faculty',
        name: selectedFaculty.name,
        phone: selectedFaculty.phone,
        department: selectedFaculty.department,
        existingFacultyId: selectedFaculty._id
      };
      
      // Use the API service function
      const response = await registerFaculty(userData);
      
      if (response.data.success) {
        message.success('User account created successfully!');
        setCreateAccountModalVisible(false);
        userForm.resetFields();
        refetchFaculty();
      } else {
        message.error(response.data.message || 'Failed to create user account');
      }
    } catch (error) {
      console.error('Error creating user account:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create user account. Please try again.';
      message.error(errorMsg);
    } finally {
      setUserFormLoading(false);
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <MailOutlined /> {record.email}
          </Space>
          <Space>
            <PhoneOutlined /> {record.phone}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      filters: [
        { text: 'Mathematics', value: 'Mathematics' },
        { text: 'Physics', value: 'Physics' },
        { text: 'Computer Science', value: 'Computer Science' },
        { text: 'Chemistry', value: 'Chemistry' },
        { text: 'English', value: 'English' },
        { text: 'History', value: 'History' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <Space size={[0, 4]} wrap>
          {subjects && subjects.map(subject => (
            <Tag color="blue" key={subject}>
              <BookOutlined /> {subject}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Account Status',
      key: 'accountStatus',
      render: (_, record) => (
        record.userId ? 
          <Tag color="green">User Account Exists</Tag> : 
          <Button 
            type="link" 
            onClick={() => handleCreateUserAccount(record)}
          >
            Create User Account
          </Button>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => {
        const color = status === 'active' ? 'green' : 'volcano';
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this faculty?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const departments = [
    'Mathematics',
    'Physics',
    'Computer Science',
    'Chemistry',
    'English',
    'History',
  ];

  const qualifications = [
    'Ph.D.',
    'M.Phil.',
    'M.Tech.',
    'M.Sc.',
    'B.Tech.',
    'B.Sc.',
  ];

  const subjectOptions = [
    'Mathematics',
    'Statistics',
    'Physics',
    'Electronics',
    'Computer Science',
    'Programming',
    'Chemistry',
    'English',
    'History',
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Manage Faculty</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={() => showModal()}
        >
          Add Faculty
        </Button>
      </div>
      
      {/* Search Form */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Search by name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="department" label="Department">
                <Select placeholder="Filter by department" allowClear>
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Filter by status" allowClear>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={resetSearch}>Reset</Button>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                  Search
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {/* Faculty Table */}
      <Card>
        <DataLoader
          loading={fetchLoading}
          error={fetchError}
          data={faculty}
          emptyMessage="No faculty members found"
        >
          <Table 
            columns={columns} 
            dataSource={faculty} 
            rowKey="_id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </DataLoader>
      </Card>

      {/* Add/Edit Faculty Modal */}
      <Modal
        title={editingFaculty ? "Edit Faculty" : "Add New Faculty"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          validateMessages={{
            required: '${label} is required!',
            types: {
              email: '${label} is not a valid email!'
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Employee ID"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter employee ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true },
                  { type: 'email' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select department">
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select qualification">
                  {qualifications.map(qual => (
                    <Option key={qual} value={qual}>{qual}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
                initialValue="active"
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="subjects"
            label="Subjects"
            rules={[{ required: true, message: 'Please select at least one subject' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Select subjects"
              style={{ width: '100%' }}
            >
              {subjectOptions.map(subject => (
                <Option key={subject} value={subject}>{subject}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Divider />
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
              >
                {editingFaculty ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Account Creation Modal */}
      <Modal
        title="Create User Account"
        open={createAccountModalVisible}
        onCancel={handleUserFormCancel}
        footer={null}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserFormSubmit}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm the password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleUserFormCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={userFormLoading}
              >
                Create Account
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFaculty;