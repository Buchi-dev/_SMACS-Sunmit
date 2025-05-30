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

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageFaculty = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [faculty, setFaculty] = useState([
    { 
      id: 1, 
      employeeId: 'FAC001', 
      name: 'John Smith', 
      email: 'john.smith@example.com',
      phone: '1234567890',
      department: 'Mathematics',
      qualification: 'Ph.D.',
      joiningDate: '2018-03-15',
      subjects: ['Mathematics', 'Statistics'],
      status: 'active'
    },
    { 
      id: 2, 
      employeeId: 'FAC002', 
      name: 'Emily Johnson', 
      email: 'emily.johnson@example.com',
      phone: '9876543210',
      department: 'Physics',
      qualification: 'Ph.D.',
      joiningDate: '2019-07-22',
      subjects: ['Physics', 'Electronics'],
      status: 'active'
    },
    { 
      id: 3, 
      employeeId: 'FAC003', 
      name: 'Michael Brown', 
      email: 'michael.brown@example.com',
      phone: '5556667777',
      department: 'Computer Science',
      qualification: 'M.Tech.',
      joiningDate: '2020-01-10',
      subjects: ['Computer Science', 'Programming'],
      status: 'inactive'
    },
  ]);
  const [filteredFaculty, setFilteredFaculty] = useState([...faculty]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const filtered = faculty.filter(f => {
      const matchName = !values.name || f.name.toLowerCase().includes(values.name.toLowerCase());
      const matchDepartment = !values.department || f.department === values.department;
      const matchStatus = !values.status || f.status === values.status;
      return matchName && matchDepartment && matchStatus;
    });
    setFilteredFaculty(filtered);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    setFilteredFaculty([...faculty]);
  };

  const handleSave = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingFaculty) {
        // Update existing faculty
        const updatedFaculty = faculty.map(f => 
          f.id === editingFaculty.id ? { ...f, ...values } : f
        );
        setFaculty(updatedFaculty);
        setFilteredFaculty(updatedFaculty);
        message.success('Faculty updated successfully!');
      } else {
        // Create new faculty
        const newFaculty = {
          id: Math.max(...faculty.map(f => f.id)) + 1,
          ...values,
        };
        const updatedFaculty = [...faculty, newFaculty];
        setFaculty(updatedFaculty);
        setFilteredFaculty(updatedFaculty);
        message.success('Faculty added successfully!');
      }
      setIsModalVisible(false);
      setLoading(false);
      form.resetFields();
    }, 500);
  };

  const handleDelete = (facultyId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedFaculty = faculty.filter(f => f.id !== facultyId);
      setFaculty(updatedFaculty);
      setFilteredFaculty(updatedFaculty);
      message.success('Faculty deleted successfully!');
      setLoading(false);
    }, 500);
  };

  const handleStatusChange = (facultyId, newStatus) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedFaculty = faculty.map(f => 
        f.id === facultyId ? { ...f, status: newStatus } : f
      );
      setFaculty(updatedFaculty);
      setFilteredFaculty(updatedFaculty);
      message.success(`Faculty ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
          {subjects.map(subject => (
            <Tag color="blue" key={subject}>
              <BookOutlined /> {subject}
            </Tag>
          ))}
        </Space>
      ),
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
        <Table 
          columns={columns} 
          dataSource={filteredFaculty} 
          rowKey="id"
          loading={loading}
        />
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
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Employee ID"
                rules={[{ required: true, message: 'Please enter employee ID' }]}
              >
                <Input placeholder="Enter employee ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
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
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
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
                rules={[{ required: true, message: 'Please select department' }]}
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
                rules={[{ required: true, message: 'Please select qualification' }]}
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
                rules={[{ required: true, message: 'Please enter joining date' }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingFaculty ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFaculty;