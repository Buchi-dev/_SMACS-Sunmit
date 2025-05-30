import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Select, 
  Button, 
  Table, 
  DatePicker, 
  Space, 
  Checkbox, 
  message,
  Divider,
  Tabs,
  Tag,
  Row,
  Col,
  Input,
  Modal,
  Alert,
  Badge,
  Tooltip,
  List,
  Avatar,
  Statistic
} from 'antd';
import { 
  CheckCircleOutlined, 
  SaveOutlined, 
  CalendarOutlined, 
  HistoryOutlined,
  ScanOutlined,
  UserOutlined,
  ContactsOutlined,
  ClockCircleOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const AttendancePanel = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isNfcScannerOpen, setIsNfcScannerOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const navigate = useNavigate();
  
  // Get today's date
  const today = dayjs();
  const formattedToday = today.format('YYYY-MM-DD');

  // Mock data - replace with actual API calls
  const subjects = [
    { 
      id: 1, 
      name: 'Mathematics', 
      schedule: 'MWF 09:00-10:30',
      room: 'Room 101'
    },
    { 
      id: 2, 
      name: 'Physics', 
      schedule: 'TTh 10:30-12:00',
      room: 'Room 102'
    },
    { 
      id: 3, 
      name: 'Computer Science', 
      schedule: 'MW 13:00-14:30',
      room: 'Computer Lab 1'
    },
  ];

  const classes = [
    { id: 1, name: 'Class A' },
    { id: 2, name: 'Class B' },
    { id: 3, name: 'Class C' },
  ];

  useEffect(() => {
    // Load today's schedule on component mount
    loadTodaySchedule();
    // Load recent check-ins
    loadRecentCheckins();
  }, []);

  const loadTodaySchedule = () => {
    setLoading(true);
    
    // Get day of week
    const dayOfWeek = today.day();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[dayOfWeek];
    
    // Mock getting today's schedule based on day of week
    setTimeout(() => {
      const todaySchedule = subjects.filter(subject => {
        // Check if subject schedule includes today's day
        const schedule = subject.schedule;
        if (currentDay === 'Monday' && schedule.includes('M')) return true;
        if (currentDay === 'Tuesday' && schedule.includes('T')) return true;
        if (currentDay === 'Wednesday' && schedule.includes('W')) return true;
        if (currentDay === 'Thursday' && schedule.includes('Th')) return true;
        if (currentDay === 'Friday' && schedule.includes('F')) return true;
        return false;
      });
      
      setScheduleData(todaySchedule.map(subject => ({
        ...subject,
        date: formattedToday,
        status: 'Pending',
        class: classes[Math.floor(Math.random() * classes.length)].name
      })));
      
      setLoading(false);
    }, 1000);
  };

  const loadRecentCheckins = () => {
    // Mock API call to get recent check-ins
    setTimeout(() => {
      const checkins = [
        { id: 1, name: 'John Doe', roll: 'S001', time: '09:05', subject: 'Mathematics', class: 'Class A' },
        { id: 2, name: 'Jane Smith', roll: 'S002', time: '08:55', subject: 'Mathematics', class: 'Class A' },
        { id: 3, name: 'Michael Johnson', roll: 'S003', time: '09:00', subject: 'Mathematics', class: 'Class A' },
        { id: 4, name: 'Sarah Wilson', roll: 'S006', time: '08:50', subject: 'Mathematics', class: 'Class A' },
        { id: 5, name: 'Jessica Taylor', roll: 'S008', time: '09:02', subject: 'Mathematics', class: 'Class A' },
      ];
      setRecentCheckins(checkins);
    }, 800);
  };

  const generateStudentList = () => {
    // Mock student list - replace with API call
    return [
      { id: 1, name: 'John Doe', roll: 'S001', isPresent: true, arrivalTime: '09:05', notes: '' },
      { id: 2, name: 'Jane Smith', roll: 'S002', isPresent: true, arrivalTime: '08:55', notes: '' },
      { id: 3, name: 'Michael Johnson', roll: 'S003', isPresent: true, arrivalTime: '09:00', notes: '' },
      { id: 4, name: 'Emily Davis', roll: 'S004', isPresent: false, arrivalTime: '', notes: '' },
      { id: 5, name: 'Robert Brown', roll: 'S005', isPresent: true, arrivalTime: '09:10', notes: 'Late by 10 minutes' },
      { id: 6, name: 'Sarah Wilson', roll: 'S006', isPresent: true, arrivalTime: '08:50', notes: '' },
      { id: 7, name: 'David Lee', roll: 'S007', isPresent: false, arrivalTime: '', notes: 'Called in sick' },
      { id: 8, name: 'Jessica Taylor', roll: 'S008', isPresent: true, arrivalTime: '09:02', notes: '' },
      { id: 9, name: 'Thomas Martinez', roll: 'S009', isPresent: true, arrivalTime: '08:58', notes: '' },
      { id: 10, name: 'Amanda Garcia', roll: 'S010', isPresent: true, arrivalTime: '09:00', notes: '' },
    ];
  };

  const handleSearch = (values) => {
    setLoading(true);
    setSelectedDate(values.date ? values.date.format('YYYY-MM-DD') : formattedToday);
    
    // Simulate API call
    setTimeout(() => {
      const students = generateStudentList();
      setAttendanceData(students);
      setShowTable(true);
      setLoading(false);
      
      // Load mock attendance history for this class and subject
      loadAttendanceHistory(values.class, values.subject);
    }, 1000);
  };

  const loadAttendanceHistory = (classId, subjectId) => {
    // Mock API call to get attendance history
    setTimeout(() => {
      const history = [];
      const today = dayjs();
      
      // Generate attendance history for the past 7 days
      for (let i = 1; i <= 7; i++) {
        const date = today.subtract(i, 'day');
        const dayOfWeek = date.day();
        
        // Skip weekends
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const totalStudents = 10;
          const presentStudents = Math.floor(Math.random() * 3) + 7; // Random number between 7-10
          
          history.push({
            id: i,
            date: date.format('YYYY-MM-DD'),
            day: date.format('dddd'),
            totalStudents,
            presentStudents,
            absentStudents: totalStudents - presentStudents,
            percentage: (presentStudents / totalStudents) * 100,
            status: 'Completed'
          });
        }
      }
      
      setAttendanceHistory(history);
    }, 500);
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId ? { 
          ...student, 
          isPresent, 
          arrivalTime: isPresent ? dayjs().format('HH:mm') : '' 
        } : student
      )
    );
  };

  const handleNoteChange = (studentId, notes) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId ? { ...student, notes } : student
      )
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      message.success('Attendance has been saved successfully!');
      setLoading(false);
      
      // Update attendance history with today's record
      const totalStudents = attendanceData.length;
      const presentStudents = attendanceData.filter(student => student.isPresent).length;
      
      setAttendanceHistory([{
        id: 0,
        date: selectedDate || formattedToday,
        day: dayjs(selectedDate || formattedToday).format('dddd'),
        totalStudents,
        presentStudents,
        absentStudents: totalStudents - presentStudents,
        percentage: (presentStudents / totalStudents) * 100,
        status: 'Completed'
      }, ...attendanceHistory]);
      
      // Update the status in schedule data
      if (selectedDate === formattedToday) {
        setScheduleData(scheduleData.map(item => {
          if (item.id === form.getFieldValue('subject')) {
            return { ...item, status: 'Completed' };
          }
          return item;
        }));
      }
    }, 1000);
  };

  const handleQuickScan = () => {
    setIsNfcScannerOpen(true);
  };

  const handleScanClose = () => {
    setIsNfcScannerOpen(false);
  };

  const handleScanComplete = (studentId) => {
    message.success(`Student ID ${studentId} has been marked present!`);
    setIsNfcScannerOpen(false);
    
    // Update attendance data with the scanned student
    if (attendanceData.length > 0) {
      const foundStudent = attendanceData.find(student => student.roll === studentId);
      if (foundStudent) {
        handleAttendanceChange(foundStudent.id, true);
      }
    }
    
    // Add to recent check-ins
    const student = generateStudentList().find(s => s.roll === studentId);
    if (student) {
      const newCheckin = {
        id: recentCheckins.length + 1,
        name: student.name,
        roll: student.roll,
        time: dayjs().format('HH:mm'),
        subject: subjects[0].name,
        class: classes[0].name
      };
      setRecentCheckins([newCheckin, ...recentCheckins]);
    }
  };

  // Main attendance marking table columns
  const columns = [
    {
      title: 'Roll Number',
      dataIndex: 'roll',
      key: 'roll',
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Checkbox 
          checked={record.isPresent}
          onChange={(e) => handleAttendanceChange(record.id, e.target.checked)}
        >
          <Tag color={record.isPresent ? 'green' : 'red'}>
            {record.isPresent ? 'Present' : 'Absent'}
          </Tag>
        </Checkbox>
      ),
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      render: (time, record) => (
        record.isPresent ? time : '-'
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes, record) => (
        <Input 
          placeholder="Add notes" 
          value={notes} 
          onChange={(e) => handleNoteChange(record.id, e.target.value)}
          style={{ width: 200 }}
        />
      ),
    },
  ];

  // Attendance history table columns
  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <Space>
          <CalendarOutlined />
          {text} ({record.day})
        </Space>
      ),
    },
    {
      title: 'Total Students',
      dataIndex: 'totalStudents',
      key: 'totalStudents',
    },
    {
      title: 'Present',
      dataIndex: 'presentStudents',
      key: 'presentStudents',
      render: (text, record) => (
        <Badge status="success" text={text} />
      ),
    },
    {
      title: 'Absent',
      dataIndex: 'absentStudents',
      key: 'absentStudents',
      render: (text, record) => (
        <Badge status="error" text={text} />
      ),
    },
    {
      title: 'Attendance %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text.toFixed(2)}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  // Today's schedule table columns
  const scheduleColumns = [
    {
      title: 'Subject',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.status === 'Completed'}
          onClick={() => {
            // Navigate to AttendanceConsole with subject information
            const path = window.location.pathname.includes('/admin') 
              ? '/admin/attendance-console' 
              : '/faculty/attendance-console';
            
            // Store selected subject in localStorage to pass data between pages
            localStorage.setItem('selectedSubject', JSON.stringify({
              id: record.id,
              name: record.name,
              schedule: record.schedule,
              room: record.room,
              class: record.class
            }));
            
            navigate(path);
          }}
        >
          Take Attendance
        </Button>
      ),
    },
  ];

  // Recent check-ins columns
  const recentCheckinsColumns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {name} ({record.roll})
        </Space>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      ),
    },
    {
      title: 'Subject & Class',
      key: 'subject',
      render: (_, record) => (
        `${record.subject} (${record.class})`
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Attendance Panel</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <DashboardOutlined />
              Dashboard
            </span>
          } 
          key="1"
        >
          <Row gutter={16}>
            <Col span={24} md={16}>
              <Card title="Today's Schedule" extra={<CalendarOutlined />}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Today: {formattedToday} ({today.format('dddd')})</Text>
                  <Button 
                    type="primary" 
                    icon={<ScanOutlined />}
                    onClick={handleQuickScan}
                  >
                    NFC Scan
                  </Button>
                </div>
                
                {scheduleData.length > 0 ? (
                  <Table 
                    columns={scheduleColumns} 
                    dataSource={scheduleData}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                  />
                ) : (
                  <Alert 
                    message="No classes scheduled for today" 
                    type="info" 
                    showIcon 
                  />
                )}
              </Card>
              
              <Card title="Recent Check-ins" style={{ marginTop: 16 }} extra={<ClockCircleOutlined />}>
                {recentCheckins.length > 0 ? (
                  <Table 
                    columns={recentCheckinsColumns} 
                    dataSource={recentCheckins}
                    rowKey="id"
                    pagination={false}
                  />
                ) : (
                  <Alert 
                    message="No recent check-ins" 
                    type="info" 
                    showIcon 
                  />
                )}
              </Card>
            </Col>
            
            <Col span={24} md={8}>
              <Card>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="Total Classes Today" 
                      value={scheduleData.length} 
                      prefix={<CalendarOutlined />} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Classes Completed" 
                      value={scheduleData.filter(item => item.status === 'Completed').length} 
                      prefix={<CheckCircleOutlined />} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Recent Check-ins" 
                      value={recentCheckins.length} 
                      prefix={<UserOutlined />} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Today's Attendance" 
                      value={attendanceHistory[0]?.percentage.toFixed(2) || 0} 
                      suffix="%" 
                      precision={2}
                      prefix={<CheckCircleOutlined />} 
                    />
                  </Col>
                </Row>
              </Card>
              
              <Card title="Attendance Summary" style={{ marginTop: 16 }} extra={<HistoryOutlined />}>
                {attendanceHistory.length > 0 ? (
                  <List
                    size="small"
                    dataSource={attendanceHistory.slice(0, 5)}
                    renderItem={item => (
                      <List.Item>
                        <Space>
                          <CalendarOutlined />
                          {item.date} ({item.day}):
                          <Badge status="success" text={`${item.presentStudents} present`} />
                          <Badge status="error" text={`${item.absentStudents} absent`} />
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Alert 
                    message="No attendance history available" 
                    type="info" 
                    showIcon 
                  />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined />
              Take Attendance
            </span>
          } 
          key="2"
        >
          <Card>
            <Form 
              form={form}
              name="attendance_search" 
              layout="horizontal" 
              onFinish={handleSearch}
              initialValues={{ date: today }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={6}>
                  <Form.Item
                    name="class"
                    label="Class"
                    rules={[{ required: true, message: 'Please select class!' }]}
                  >
                    <Select placeholder="Select Class">
                      {classes.map(cls => (
                        <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={6}>
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: 'Please select subject!' }]}
                  >
                    <Select placeholder="Select Subject">
                      {subjects.map(subject => (
                        <Option key={subject.id} value={subject.id}>
                          {subject.name}
                          <Text type="secondary" style={{ marginLeft: 5 }}>
                            ({subject.schedule})
                          </Text>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={6}>
                  <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Please select date!' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<CheckCircleOutlined />}
                    loading={loading}
                    style={{ marginBottom: 24 }}
                  >
                    Get Students
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
          
          {showTable && (
            <Card style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4}>Mark Attendance</Title>
                <Space>
                  <Button 
                    icon={<ContactsOutlined />} 
                    onClick={handleQuickScan}
                  >
                    NFC Scan
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSubmit}
                    loading={loading}
                  >
                    Save Attendance
                  </Button>
                </Space>
              </div>
              
              <Divider />
              
              <Table 
                columns={columns} 
                dataSource={attendanceData}
                rowKey="id"
                pagination={false}
                summary={(pageData) => {
                  const presentCount = pageData.filter(item => item.isPresent).length;
                  const absentCount = pageData.length - presentCount;
                  const presentPercentage = (presentCount / pageData.length) * 100;
                  
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={2}><strong>Summary</strong></Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Space>
                          <Text type="success">Present: {presentCount}</Text>
                          <Text type="danger">Absent: {absentCount}</Text>
                          <Text>Percentage: {presentPercentage.toFixed(2)}%</Text>
                        </Space>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell colSpan={2} />
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <HistoryOutlined />
              Attendance History
            </span>
          } 
          key="3"
        >
          <Card>
            {attendanceHistory.length > 0 ? (
              <Table 
                columns={historyColumns} 
                dataSource={attendanceHistory}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <Alert 
                message="No attendance history available. Please take attendance first." 
                type="info" 
                showIcon 
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* NFC Scanner Modal */}
      <Modal
        title="Scan Student ID Card"
        open={isNfcScannerOpen}
        onCancel={handleScanClose}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 250, 
            height: 250, 
            margin: '0 auto', 
            border: '1px solid #d9d9d9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            flexDirection: 'column'
          }}>
            <ContactsOutlined style={{ fontSize: 100, opacity: 0.3 }} />
            <Text type="secondary" style={{ marginTop: 16 }}>Waiting for NFC card...</Text>
          </div>
          <p>Place student ID card on the NFC scanner</p>
          <Search
            placeholder="Or enter student ID manually"
            enterButton="Mark Present"
            onSearch={handleScanComplete}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePanel;