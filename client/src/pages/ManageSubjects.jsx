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
  HomeOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { 
  getAllSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject,
  getSubjectsByFaculty,
  getAllFaculty
} from '../services/api';
import DataLoader from '../components/DataLoader';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

const ManageSubjects = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const { user, role } = useAuth();

  // Fetch subjects data based on user role
  const { 
    data: subjectsData,
    loading: fetchLoading,
    error: fetchError,
    refetch: refetchSubjects
  } = useFetch(
    role === 'admin' ? getAllSubjects : getSubjectsByFaculty, 
    {
      initialParams: role === 'admin' ? searchParams : user?.id,
      dependencies: [role, user?.id, searchParams]
    }
  );

  // Fetch faculty data for admin users
  const {
    data: facultyData,
    loading: facultyLoading
  } = useFetch(getAllFaculty, {
    fetchOnMount: role === 'admin',
    dependencies: [role]
  });

  // Extract faculty array from API response
  const faculty = facultyData?.data || [];

  // Extract subjects array from API response
  const subjects = subjectsData?.data || [];

  useEffect(() => {
    if (fetchError) {
      message.error('Failed to fetch subjects: ' + fetchError);
    }
  }, [fetchError]);

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
      if (role === 'faculty') {
        form.setFieldsValue({
          faculty: user?.name,
          facultyId: user?.id
        });
      }
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
      if (!subjectData.facultyId && role === 'faculty') {
        subjectData.facultyId = user?.id;
        subjectData.faculty = user?.name;
      }
      
      // Ensure facultyId and faculty fields are present
      if (!subjectData.facultyId || !subjectData.faculty) {
        throw new Error('Faculty information is required');
      }
      
      console.log('Subject data to be sent:', subjectData);
      
      if (editingSubject) {
        // Update existing subject
        await updateSubject(editingSubject._id, subjectData);
        message.success('Subject updated successfully!');
      } else {
        // Create new subject
        await createSubject(subjectData);
        message.success('Subject added successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      refetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Operation failed';
      message.error(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      await deleteSubject(subjectId);
      message.success('Subject deleted successfully!');
      refetchSubjects();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Delete failed';
      message.error(errorMsg);
    }
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
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      sorter: (a, b) => a.faculty.localeCompare(b.faculty),
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
      filters: [
        { text: 'Room 101', value: 'Room 101' },
        { text: 'Room 102', value: 'Room 102' },
        { text: 'Room 103', value: 'Room 103' },
        { text: 'Computer Lab 1', value: 'Computer Lab 1' },
        { text: 'Computer Lab 2', value: 'Computer Lab 2' },
      ],
      onFilter: (value, record) => record.room === value,
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
      sorter: (a, b) => a.enrolledStudents - b.enrolledStudents,
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
              disabled={role === 'faculty' && record.facultyId !== user?.id}
            />
          </Tooltip>
          <Tooltip title="Delete Subject">
            <Popconfirm
              title="Are you sure you want to delete this subject?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              // Disable delete for faculty users if not their subject
              disabled={role === 'faculty' && record.facultyId !== user?.id}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                disabled={role === 'faculty' && record.facultyId !== user?.id}
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

  // Handle faculty selection change
  const handleFacultyChange = (value, option) => {
    form.setFieldsValue({
      faculty: option.label,
      facultyId: value
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>
          {role === 'admin' ? 'Manage All Subjects' : 'My Subjects'}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Add Subject
        </Button>
      </div>
      
      {/* Search Form (Admin only) */}
      {role === 'admin' && (
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="horizontal"
            onFinish={handleSearch}
          >
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item name="code" label="Subject Code">
                  <Input placeholder="Search by code" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="name" label="Subject Name">
                  <Input placeholder="Search by name" />
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
      )}
      
      <Card>
        {role === 'faculty' && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">Note: As a faculty member, you can only manage your own subjects.</Tag>
          </div>
        )}
        
        <DataLoader
          loading={fetchLoading}
          error={fetchError}
          data={subjects}
          emptyMessage="No subjects found"
        >
          <Table 
            columns={columns} 
            dataSource={subjects} 
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
          validateMessages={{
            required: '${label} is required!',
            types: {
              number: '${label} must be a valid number!'
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Subject Code"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter subject code (e.g. MATH101)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Subject Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter subject name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              {role === 'admin' ? (
                <Form.Item
                  label="Faculty"
                  required
                  tooltip="Select the faculty member for this subject"
                >
                  <Form.Item 
                    name="facultyId"
                    noStyle
                    rules={[{ required: true, message: 'Please select a faculty member' }]}
                  >
                    <Select 
                      placeholder="Select faculty member"
                      loading={facultyLoading}
                      onChange={handleFacultyChange}
                      optionFilterProp="label"
                      showSearch
                    >
                      {faculty.map(f => (
                        <Option key={f._id} value={f._id} label={f.name}>
                          {f.name} ({f.department})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="faculty" hidden>
                    <Input />
                  </Form.Item>
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="faculty"
                    label="Faculty"
                    rules={[{ required: true }]}
                    disabled={role === 'faculty'}
                  >
                    <Input placeholder="Enter faculty name" disabled={role === 'faculty'} />
                  </Form.Item>
                  {/* Hidden field to store facultyId */}
                  <Form.Item name="facultyId" hidden={true}>
                    <Input />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                name="enrolledStudents"
                label="Enrolled Students"
                rules={[{ required: true, type: 'number', min: 0 }]}
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
                rules={[{ required: true, type: 'array', min: 1, message: 'Please select at least one day' }]}
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
                rules={[{ required: true }]}
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
                rules={[{ required: true }]}
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
          
          <Divider />
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
              >
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