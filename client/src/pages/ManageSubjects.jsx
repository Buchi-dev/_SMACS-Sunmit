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
  Tag,
  InputNumber,
  Tooltip,
  TimePicker,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

// Mock user data - in a real app, this would come from authentication context/state
const currentUser = {
  id: 'faculty123',
  name: 'John Smith',
  role: 'faculty', // 'admin' or 'faculty'
};

const ManageSubjects = () => {
  const [form] = Form.useForm();
  const [allSubjects, setAllSubjects] = useState([
    { 
      id: 1, 
      code: 'MATH101', 
      name: 'Mathematics', 
      faculty: 'John Smith',
      facultyId: 'faculty123',
      enrolledStudents: 35,
      status: 'active',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeStart: '09:00',
        timeEnd: '10:30'
      },
      room: 'Room 101'
    },
    { 
      id: 2, 
      code: 'PHY101', 
      name: 'Physics', 
      faculty: 'Emily Johnson',
      facultyId: 'faculty456',
      enrolledStudents: 28,
      status: 'active',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        timeStart: '10:30',
        timeEnd: '12:00'
      },
      room: 'Room 102'
    },
    { 
      id: 3, 
      code: 'CS101', 
      name: 'Computer Science', 
      faculty: 'Michael Brown',
      facultyId: 'faculty789',
      enrolledStudents: 42,
      status: 'active',
      schedule: {
        days: ['Monday', 'Wednesday'],
        timeStart: '13:00',
        timeEnd: '14:30'
      },
      room: 'Computer Lab 1'
    },
    { 
      id: 4, 
      code: 'ENG101', 
      name: 'English', 
      faculty: 'Sarah Davis',
      facultyId: 'faculty101',
      enrolledStudents: 30,
      status: 'inactive',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        timeStart: '14:30',
        timeEnd: '16:00'
      },
      room: 'Room 103'
    },
  ]);
  
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter subjects based on user role
  useEffect(() => {
    if (currentUser.role === 'admin') {
      // Admin can see all subjects
      setDisplayedSubjects(allSubjects);
    } else {
      // Faculty can only see their own subjects
      const facultySubjects = allSubjects.filter(
        subject => subject.facultyId === currentUser.id
      );
      setDisplayedSubjects(facultySubjects);
    }
  }, [allSubjects]);

  const showModal = (subject = null) => {
    setEditingSubject(subject);
    setIsModalVisible(true);
    if (subject) {
      form.setFieldsValue({
        code: subject.code,
        name: subject.name,
        faculty: subject.faculty,
        facultyId: subject.facultyId,
        enrolledStudents: subject.enrolledStudents,
        status: subject.status,
        days: subject.schedule.days,
        time: [dayjs(subject.schedule.timeStart, 'HH:mm'), dayjs(subject.schedule.timeEnd, 'HH:mm')],
        room: subject.room
      });
    } else {
      form.resetFields();
      // For faculty users, pre-fill the faculty field with their own name
      if (currentUser.role === 'faculty') {
        form.setFieldsValue({
          faculty: currentUser.name,
          facultyId: currentUser.id
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values) => {
    setLoading(true);
    
    // Prepare schedule data
    const schedule = {
      days: values.days,
      timeStart: values.time[0].format('HH:mm'),
      timeEnd: values.time[1].format('HH:mm')
    };
    
    // Remove temporary form fields and add schedule object
    const { days, time, ...restValues } = values;
    const subjectData = {
      ...restValues,
      schedule,
      room: values.room
    };
    
    // Add facultyId if not provided (for faculty users creating new subjects)
    if (!subjectData.facultyId && currentUser.role === 'faculty') {
      subjectData.facultyId = currentUser.id;
      subjectData.faculty = currentUser.name;
    }
    
    // Simulate API call
    setTimeout(() => {
      if (editingSubject) {
        // Update existing subject
        const updatedSubjects = allSubjects.map(subject => 
          subject.id === editingSubject.id ? { ...subject, ...subjectData } : subject
        );
        setAllSubjects(updatedSubjects);
        message.success('Subject updated successfully!');
      } else {
        // Create new subject
        const newSubject = {
          id: Math.max(...allSubjects.map(s => s.id)) + 1,
          ...subjectData,
        };
        setAllSubjects([...allSubjects, newSubject]);
        message.success('Subject added successfully!');
      }
      setIsModalVisible(false);
      setLoading(false);
      form.resetFields();
    }, 500);
  };

  const handleDelete = (subjectId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAllSubjects(allSubjects.filter(subject => subject.id !== subjectId));
      message.success('Subject deleted successfully!');
      setLoading(false);
    }, 500);
  };

  const formatSchedule = (schedule) => {
    if (!schedule) return '';
    return `${schedule.days.join(', ')} ${schedule.timeStart} - ${schedule.timeEnd}`;
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <BookOutlined style={{ color: '#1677ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      key: 'faculty',
    },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1677ff' }} />
          {formatSchedule(record.schedule)}
        </Space>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
      render: (room) => (
        <Space>
          <HomeOutlined style={{ color: '#1677ff' }} />
          {room}
        </Space>
      ),
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrolledStudents',
      key: 'enrolledStudents',
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
          <Tooltip title="View/Edit Subject">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showModal(record)}
              // Disable edit for faculty users if not their subject
              disabled={currentUser.role === 'faculty' && record.facultyId !== currentUser.id}
            />
          </Tooltip>
          <Tooltip title="Delete Subject">
            <Popconfirm
              title="Are you sure you want to delete this subject?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              // Disable delete for faculty users if not their subject
              disabled={currentUser.role === 'faculty' && record.facultyId !== currentUser.id}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                disabled={currentUser.role === 'faculty' && record.facultyId !== currentUser.id}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const dayOptions = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ];

  const roomOptions = [
    'Room 101',
    'Room 102',
    'Room 103',
    'Room 104',
    'Room 105',
    'Computer Lab 1',
    'Computer Lab 2',
    'Science Lab',
    'Physics Lab',
    'Chemistry Lab',
    'Auditorium'
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>
          {currentUser.role === 'admin' ? 'Manage All Subjects' : 'My Subjects'}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Add Subject
        </Button>
      </div>
      
      <Card>
        {currentUser.role === 'faculty' && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">Note: As a faculty member, you can only manage your own subjects.</Tag>
          </div>
        )}
        
        <Table 
          columns={columns} 
          dataSource={displayedSubjects} 
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
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
                name="code"
                label="Subject Code"
                rules={[{ required: true, message: 'Please enter subject code' }]}
              >
                <Input placeholder="Enter subject code (e.g. MATH101)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Subject Name"
                rules={[{ required: true, message: 'Please enter subject name' }]}
              >
                <Input placeholder="Enter subject name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="faculty"
                label="Faculty"
                rules={[{ required: true, message: 'Please enter faculty name' }]}
                // Disable for faculty users
                disabled={currentUser.role === 'faculty'}
              >
                <Input placeholder="Enter faculty name" disabled={currentUser.role === 'faculty'} />
              </Form.Item>
              {/* Hidden field to store facultyId */}
              <Form.Item name="facultyId" hidden={true}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enrolledStudents"
                label="Enrolled Students"
                rules={[{ required: true, message: 'Please enter number of enrolled students' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter number of enrolled students" />
              </Form.Item>
            </Col>
          </Row>
          
          {/* Schedule Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="days"
                label="Days"
                rules={[{ required: true, message: 'Please select days' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="Select days"
                  options={dayOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: 'Please select time range' }]}
              >
                <RangePicker 
                  format="HH:mm"
                  placeholder={['Start Time', 'End Time']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="room"
                label="Room"
                rules={[{ required: true, message: 'Please select room' }]}
              >
                <Select placeholder="Select room">
                  {roomOptions.map(room => (
                    <Option key={room} value={room}>{room}</Option>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSubject ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSubjects;