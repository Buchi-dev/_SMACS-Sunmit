import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Card, 
  Input, 
  Button, 
  Space, 
  Table, 
  Tag, 
  Alert, 
  Divider, 
  Row, 
  Col, 
  Statistic, 
  Select,
  message,
  List,
  Avatar
} from 'antd';
import { 
  UserOutlined, 
  ScanOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const AttendanceConsole = () => {
  const [studentId, setStudentId] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [recentCheckins, setRecentCheckins] = useState([
    {
      id: 1,
      studentId: 'S001',
      name: 'John Doe',
      course: 'BS Computer Science',
      section: 'CS-1A',
      subject: 'Mathematics 101',
      time: '09:15:32',
      date: dayjs().format('YYYY-MM-DD')
    },
    {
      id: 2,
      studentId: 'S002',
      name: 'Jane Smith',
      course: 'BS Information Technology',
      section: 'IT-2B',
      subject: 'Introduction to Programming',
      time: '09:05:47',
      date: dayjs().format('YYYY-MM-DD')
    },
    {
      id: 3,
      studentId: 'S003',
      name: 'Michael Johnson',
      course: 'BS Computer Science',
      section: 'CS-1A',
      subject: 'Database Systems',
      time: '08:58:21',
      date: dayjs().format('YYYY-MM-DD')
    },
    {
      id: 4,
      studentId: 'S004',
      name: 'Emily Davis',
      course: 'BS Information Systems',
      section: 'IS-3C',
      subject: 'Web Development',
      time: '08:45:09',
      date: dayjs().format('YYYY-MM-DD')
    },
    {
      id: 5,
      studentId: 'S005',
      name: 'Robert Brown',
      course: 'BS Information Technology',
      section: 'IT-2B',
      subject: 'Data Structures',
      time: '08:30:55',
      date: dayjs().format('YYYY-MM-DD')
    },
    {
      id: 6,
      studentId: 'S001',
      name: 'John Doe',
      course: 'BS Computer Science',
      section: 'CS-1A',
      subject: 'Database Systems',
      time: '10:22:17',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    },
    {
      id: 7,
      studentId: 'S003',
      name: 'Michael Johnson',
      course: 'BS Computer Science',
      section: 'CS-1A',
      subject: 'Mathematics 101',
      time: '09:33:40',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    },
    {
      id: 8,
      studentId: 'S002',
      name: 'Jane Smith',
      course: 'BS Information Technology',
      section: 'IT-2B',
      subject: 'Web Development',
      time: '13:15:05',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [scanMode, setScanMode] = useState(false);
  const inputRef = useRef(null);

  // Simulated data - replace with actual API calls in production
  const studentData = [
    { id: 'S001', name: 'John Doe', course: 'BS Computer Science', section: 'CS-1A', img: null },
    { id: 'S002', name: 'Jane Smith', course: 'BS Information Technology', section: 'IT-2B', img: null },
    { id: 'S003', name: 'Michael Johnson', course: 'BS Computer Science', section: 'CS-1A', img: null },
    { id: 'S004', name: 'Emily Davis', course: 'BS Information Systems', section: 'IS-3C', img: null },
    { id: 'S005', name: 'Robert Brown', course: 'BS Information Technology', section: 'IT-2B', img: null },
  ];

  useEffect(() => {
    // Load subjects on component mount
    fetchSubjects();
    
    // Check if we have a selected subject in localStorage (from AttendancePanel)
    const storedSubject = localStorage.getItem('selectedSubject');
    if (storedSubject) {
      try {
        const subjectData = JSON.parse(storedSubject);
        
        // Set scan mode active if coming from AttendancePanel
        setScanMode(true);
        
        // We'll set the selected subject after subjects are loaded
        setTimeout(() => {
          setSelectedSubject(subjectData.id);
          message.info(`Ready to take attendance for ${subjectData.name}`);
        }, 600);
        
        // Clear the stored subject to avoid reusing it on page refresh
        localStorage.removeItem('selectedSubject');
      } catch (error) {
        console.error('Error parsing stored subject:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Focus on input when in scan mode
    if (scanMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanMode]);

  const fetchSubjects = () => {
    // Simulated API call to fetch subjects
    setTimeout(() => {
      const subjectData = [
        { id: 1, name: 'Mathematics 101', schedule: 'MWF 09:00-10:30', room: 'Room 101' },
        { id: 2, name: 'Introduction to Programming', schedule: 'TTh 10:30-12:00', room: 'Computer Lab 1' },
        { id: 3, name: 'Database Systems', schedule: 'MW 13:00-14:30', room: 'Room 203' },
        { id: 4, name: 'Web Development', schedule: 'TTh 15:00-16:30', room: 'Computer Lab 2' },
        { id: 5, name: 'Data Structures', schedule: 'MWF 11:00-12:30', room: 'Room 105' },
      ];
      setSubjects(subjectData);
    }, 500);
  };

  const handleIdScan = (value) => {
    if (!value) return;
    
    setLoading(true);
    setStudentId(value);
    
    // Simulate API call to fetch student data
    setTimeout(() => {
      const student = studentData.find(s => s.id === value);
      
      if (student) {
        setCurrentStudent(student);
        recordAttendance(student);
        message.success(`Successfully scanned ID for ${student.name}`);
      } else {
        setCurrentStudent(null);
        message.error('Student ID not found');
      }
      
      setLoading(false);
      
      // Clear input after processing
      setStudentId('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 800);
  };

  const recordAttendance = (student) => {
    if (!selectedSubject) {
      message.warning('No subject selected. Please select a subject first.');
      return;
    }
    
    // Simulate API call to record attendance
    const timestamp = dayjs().format('HH:mm:ss');
    const date = dayjs().format('YYYY-MM-DD');
    
    const newCheckin = {
      id: Date.now(),
      studentId: student.id,
      name: student.name,
      course: student.course,
      section: student.section,
      subject: subjects.find(s => s.id === selectedSubject)?.name || 'Unknown Subject',
      time: timestamp,
      date: date
    };
    
    // Add to recent check-ins at the beginning of the array
    setRecentCheckins(prev => [newCheckin, ...prev].slice(0, 20));
  };

  const toggleScanMode = () => {
    setScanMode(prev => !prev);
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      )
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Course & Section',
      key: 'courseSection',
      render: (_, record) => (
        <Text>{record.course} - {record.section}</Text>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Tag color="blue">{subject}</Tag>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color="green">
          <CheckCircleOutlined /> Present
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        <ScanOutlined /> Attendance Console
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="ID Scan Terminal" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="Please select a subject before scanning student IDs"
                type="info"
                showIcon
              />
              
              <Row gutter={16}>
                <Col span={16}>
                  <Select
                    placeholder="Select Subject"
                    style={{ width: '100%' }}
                    onChange={handleSubjectChange}
                    value={selectedSubject}
                  >
                    {subjects.map(subject => (
                      <Option key={subject.id} value={subject.id}>
                        {subject.name} - {subject.schedule} ({subject.room})
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Button 
                    type={scanMode ? "primary" : "default"} 
                    icon={<ScanOutlined />} 
                    onClick={toggleScanMode}
                    block
                  >
                    {scanMode ? "Scanning Active" : "Start Scanning"}
                  </Button>
                </Col>
              </Row>
              
              {scanMode && (
                <>
                  <Divider>Scan Student ID</Divider>
                  <Search
                    ref={inputRef}
                    placeholder="Scan or enter student ID"
                    enterButton="Submit"
                    size="large"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onSearch={handleIdScan}
                    loading={loading}
                    autoFocus
                  />
                </>
              )}
              
              {currentStudent && (
                <>
                  <Divider>Last Scanned Student</Divider>
                  <Card>
                    <Row gutter={16} align="middle">
                      <Col span={4}>
                        <Avatar 
                          size={80} 
                          icon={<UserOutlined />} 
                          src={currentStudent.img} 
                        />
                      </Col>
                      <Col span={20}>
                        <Title level={4}>{currentStudent.name}</Title>
                        <Space direction="vertical">
                          <Text><strong>ID:</strong> {currentStudent.id}</Text>
                          <Text><strong>Course:</strong> {currentStudent.course}</Text>
                          <Text><strong>Section:</strong> {currentStudent.section}</Text>
                          <Text>
                            <strong>Checked in:</strong> {dayjs().format('HH:mm:ss')} - 
                            <Tag color="green" style={{ marginLeft: 8 }}>
                              <CheckCircleOutlined /> Attendance Recorded
                            </Tag>
                          </Text>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </>
              )}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Attendance Statistics" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Today's Check-ins" 
                  value={recentCheckins.length} 
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Current Subject" 
                  value={selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'None'} 
                  prefix={<BookOutlined />}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Current Time" 
                  value={dayjs().format('HH:mm:ss')} 
                  prefix={<ClockCircleOutlined />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Active Session" 
                  value={scanMode ? 'Active' : 'Inactive'} 
                  valueStyle={{ color: scanMode ? '#3f8600' : '#cf1322' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">
        <Space>
          <TeamOutlined />
          Recent Check-ins
        </Space>
      </Divider>
      
      <Table 
        columns={columns} 
        dataSource={recentCheckins} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AttendanceConsole;