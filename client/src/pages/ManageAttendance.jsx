import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  Input, 
  Row, 
  Col, 
  Tabs, 
  Tag, 
  Statistic, 
  Progress,
  Divider,
  message,
  Modal,
  List,
  Avatar,
  Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined, 
  UserOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ManageAttendance = () => {
  const [searchForm] = Form.useForm();
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();

  // Mock data
  const classes = [
    { id: 1, name: 'Class A' },
    { id: 2, name: 'Class B' },
    { id: 3, name: 'Class C' },
    { id: 4, name: 'Class D' },
    { id: 5, name: 'Class E' },
  ];

  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Computer Science' },
  ];

  const students = [
    { id: 1, name: 'John Doe', rollNumber: 'STD001' },
    { id: 2, name: 'Jane Smith', rollNumber: 'STD002' },
    { id: 3, name: 'Michael Johnson', rollNumber: 'STD003' },
    { id: 4, name: 'Emily Davis', rollNumber: 'STD004' },
    { id: 5, name: 'Robert Brown', rollNumber: 'STD005' },
  ];

  // Mock attendance data generator
  const generateAttendanceData = (classId, subjectId, dateRange) => {
    const startDate = dateRange[0] ? dateRange[0].toDate() : new Date();
    const endDate = dateRange[1] ? dateRange[1].toDate() : new Date();
    
    const dates = [];
    let currentDate = new Date(startDate);
    
    // Generate a list of dates between start and end
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Generate attendance data for each student and date
    const data = [];
    students.forEach(student => {
      dates.forEach(date => {
        const isPresent = Math.random() > 0.2; // 80% chance of being present
        data.push({
          id: `${student.id}-${date.getTime()}`,
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          classId,
          className: classes.find(c => c.id === classId)?.name || '',
          subjectId,
          subjectName: subjects.find(s => s.id === subjectId)?.name || '',
          date: date.toISOString().split('T')[0],
          status: isPresent ? 'present' : 'absent',
        });
      });
    });
    
    return data;
  };

  // Generate summary data
  const generateSummaryData = (attendanceData) => {
    const studentMap = new Map();
    
    attendanceData.forEach(record => {
      if (!studentMap.has(record.studentId)) {
        studentMap.set(record.studentId, {
          studentId: record.studentId,
          studentName: record.studentName,
          rollNumber: record.rollNumber,
          totalClasses: 0,
          present: 0,
          absent: 0,
        });
      }
      
      const student = studentMap.get(record.studentId);
      student.totalClasses += 1;
      if (record.status === 'present') {
        student.present += 1;
      } else {
        student.absent += 1;
      }
    });
    
    return Array.from(studentMap.values()).map(student => ({
      ...student,
      percentage: student.totalClasses > 0 
        ? ((student.present / student.totalClasses) * 100).toFixed(2) 
        : 0,
    }));
  };

  const handleSearch = (values) => {
    setLoading(true);
    setSelectedClass(values.class);
    setSelectedSubject(values.subject);
    setDateRange(values.dateRange);
    
    // Simulate API call
    setTimeout(() => {
      const data = generateAttendanceData(
        values.class, 
        values.subject, 
        values.dateRange
      );
      setAttendanceData(data);
      setSummaryData(generateSummaryData(data));
      setLoading(false);
    }, 1000);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    setAttendanceData([]);
    setSummaryData([]);
    setSelectedClass(null);
    setSelectedSubject(null);
    setDateRange([]);
  };

  const exportAttendance = () => {
    message.success('Attendance report exported successfully!');
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    editForm.setFieldsValue({
      status: record.status === 'present',
    });
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    editForm.resetFields();
  };

  const handleEditSave = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedData = attendanceData.map(item => 
        item.id === editingRecord.id 
          ? { ...item, status: values.status ? 'present' : 'absent' } 
          : item
      );
      setAttendanceData(updatedData);
      setSummaryData(generateSummaryData(updatedData));
      setIsModalVisible(false);
      message.success('Attendance updated successfully!');
      setLoading(false);
    }, 500);
  };

  // Attendance records tab columns
  const attendanceColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {date}
        </Space>
      ),
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {name}
        </Space>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Subject',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'present' ? 'green' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          icon={<EditOutlined />} 
          size="small" 
          onClick={() => showEditModal(record)}
        />
      ),
    },
  ];

  // Summary tab columns
  const summaryColumns = [
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {name}
        </Space>
      ),
    },
    {
      title: 'Total Classes',
      dataIndex: 'totalClasses',
      key: 'totalClasses',
    },
    {
      title: 'Present',
      dataIndex: 'present',
      key: 'present',
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
    },
    {
      title: 'Attendance %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <Progress 
          percent={parseFloat(percentage)} 
          size="small" 
          status={parseFloat(percentage) < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const percentage = parseFloat(record.percentage);
        let color = 'green';
        let text = 'Good';
        
        if (percentage < 75) {
          color = 'red';
          text = 'Poor';
        } else if (percentage < 85) {
          color = 'orange';
          text = 'Average';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Title level={2}>Manage Attendance</Title>
      
      {/* Search Form */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="class" 
                label="Class" 
                rules={[{ required: true, message: 'Please select class' }]}
              >
                <Select placeholder="Select class">
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="subject" 
                label="Subject" 
                rules={[{ required: true, message: 'Please select subject' }]}
              >
                <Select placeholder="Select subject">
                  {subjects.map(subject => (
                    <Option key={subject.id} value={subject.id}>{subject.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="dateRange" 
                label="Date Range" 
                rules={[{ required: true, message: 'Please select date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={resetSearch}>Reset</Button>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                  Search
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {attendanceData.length > 0 && (
        <>
          {/* Stats Cards */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic 
                  title="Total Classes" 
                  value={dateRange.length > 0 
                    ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') + 1 
                    : 0} 
                  suffix="days"
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic 
                  title="Average Attendance" 
                  value={summaryData.length > 0 
                    ? (summaryData.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / summaryData.length).toFixed(2)
                    : 0
                  } 
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic 
                  title="Students Below 75%" 
                  value={summaryData.filter(s => parseFloat(s.percentage) < 75).length} 
                  suffix={`/ ${summaryData.length}`}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Export Button */}
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<FileExcelOutlined />} 
              onClick={exportAttendance}
            >
              Export to Excel
            </Button>
          </div>
          
          {/* Tabs */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Attendance Records" key="1">
                <Table 
                  columns={attendanceColumns} 
                  dataSource={attendanceData} 
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
              <TabPane tab="Attendance Summary" key="2">
                <Table 
                  columns={summaryColumns} 
                  dataSource={summaryData} 
                  rowKey="studentId"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Attendance Record"
        open={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        {editingRecord && (
          <>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={editingRecord.studentName}
                description={`Roll Number: ${editingRecord.rollNumber}`}
              />
            </List.Item>
            <Divider />
            <List.Item>
              <List.Item.Meta
                title="Date"
                description={editingRecord.date}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Subject"
                description={editingRecord.subjectName}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Class"
                description={editingRecord.className}
              />
            </List.Item>
            <Divider />
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleEditSave}
            >
              <Form.Item
                name="status"
                valuePropName="checked"
              >
                <Checkbox>Mark as Present</Checkbox>
              </Form.Item>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleEditCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ManageAttendance;