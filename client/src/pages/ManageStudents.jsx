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
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import useFetch from '../hooks/useFetch';
import { 
  getAllStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const ManageStudents = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  // Fetch students data
  const { 
    data: studentsData,
    loading: fetchLoading,
    error: fetchError,
    refetch: refetchStudents
  } = useFetch(getAllStudents, {
    initialParams: searchParams,
    dependencies: [searchParams]
  });

  // Extract students array from API response
  const students = studentsData?.data || [];

  useEffect(() => {
    if (fetchError) {
      message.error('Failed to fetch students: ' + fetchError);
    }
  }, [fetchError]);

  // Available subjects
  const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography'
  ];

  // Year options
  const yearOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year'
  ];

  // Course options
  const courseOptions = [
    'Computer Science',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Business Administration',
    'Arts and Humanities'
  ];

  // Class section options
  const classOptions = ['A', 'B', 'C', 'D', 'E'];

  const showModal = (student = null) => {
    setEditingStudent(student);
    setIsModalVisible(true);
    if (student) {
      form.setFieldsValue({
        rollNumber: student.rollNumber,
        name: student.name,
        nfcId: student.nfcId,
        year: student.year,
        course: student.course,
        class: student.class,
        status: student.status,
        subjects: student.subjects || []
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
      // Ensure subjects is an array
      const studentData = {
        ...values,
        subjects: values.subjects || []
      };
      
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent._id, studentData);
        message.success('Student updated successfully!');
      } else {
        // Create new student
        await createStudent(studentData);
        message.success('Student added successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      refetchStudents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteStudent(studentId);
      message.success('Student deleted successfully!');
      refetchStudents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Delete failed';
      message.error(errorMsg);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await updateStudent(studentId, { status: newStatus });
      message.success(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      refetchStudents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Status update failed';
      message.error(errorMsg);
    }
  };

  const columns = [
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (year) => (
        <Space>
          <CalendarOutlined />
          {year}
        </Space>
      )
    },
    {
      title: 'Course & Class',
      key: 'courseClass',
      render: (_, record) => (
        <span>{record.course} (Class {record.class})</span>
      ),
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
          <Tooltip title="Edit Student">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Student">
            <Popconfirm
              title="Are you sure you want to delete this student?"
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Manage Students</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={() => showModal()}
        >
          Add Student
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
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Search by name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="nfcId" label="NFC ID">
                <Input placeholder="Search by NFC ID" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="year" label="Year">
                <Select placeholder="Filter by year" allowClear>
                  {yearOptions.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="course" label="Course">
                <Select placeholder="Filter by course" allowClear>
                  {courseOptions.map(course => (
                    <Option key={course} value={course}>{course}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="class" label="Class">
                <Select placeholder="Filter by class" allowClear>
                  {classOptions.map(cls => (
                    <Option key={cls} value={cls}>Class {cls}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="subject" label="Subject">
                <Select placeholder="Filter by subject" allowClear>
                  {subjectOptions.map(subject => (
                    <Option key={subject} value={subject}>{subject}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Filter by status" allowClear>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
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
      
      {/* Students Table */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={students} 
          rowKey="_id"
          loading={fetchLoading}
        />
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
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
                name="rollNumber"
                label="Roll Number"
                rules={[{ required: true, message: 'Please enter roll number' }]}
              >
                <Input placeholder="Enter roll number" />
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
                name="nfcId"
                label="NFC ID"
                rules={[{ required: true, message: 'Please enter NFC ID' }]}
              >
                <Input placeholder="Enter NFC ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="year"
                label="Year"
                rules={[{ required: true, message: 'Please select year' }]}
              >
                <Select placeholder="Select year">
                  {yearOptions.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select course' }]}
              >
                <Select placeholder="Select course">
                  {courseOptions.map(course => (
                    <Option key={course} value={course}>{course}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="class"
                label="Class"
                rules={[{ required: true, message: 'Please select class' }]}
              >
                <Select placeholder="Select class">
                  {classOptions.map(cls => (
                    <Option key={cls} value={cls}>Class {cls}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
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
          
          <Divider />
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={fetchLoading}
              >
                {editingStudent ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStudents;