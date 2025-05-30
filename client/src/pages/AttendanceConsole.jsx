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
  Avatar,
  Empty
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
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { getStudentByNfcId, getAllSubjects, getSubjectsByFaculty } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const AttendanceConsole = () => {
  const [studentId, setStudentId] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [scanMode, setScanMode] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const inputRef = useRef(null);
  const { user, role } = useAuth();
  
  // Use Attendance Context
  const { 
    recordAttendance, 
    recentCheckins, 
    loading: attendanceLoading, 
    currentSession,
    startSession,
    endSession,
    error: attendanceError,
    fetchRecentCheckins
  } = useAttendance();

  // Fetch subjects based on role
  const { 
    data: subjectsData,
    loading: subjectsLoading,
    error: subjectsError
  } = useFetch(
    role === 'admin' ? getAllSubjects : getSubjectsByFaculty, 
    {
      initialParams: role === 'admin' ? {} : user?.id,
      dependencies: [role, user?.id]
    }
  );

  // Extract subjects array
  const subjects = subjectsData?.data || [];

  useEffect(() => {
    // Fetch recent check-ins when component mounts
    fetchRecentCheckins();
    
    // Check if we have a selected subject in localStorage (from AttendancePanel)
    const storedSubject = localStorage.getItem('selectedSubject');
    if (storedSubject) {
      try {
        const subjectData = JSON.parse(storedSubject);
        
        // Set scan mode active if coming from AttendancePanel
        setScanMode(true);
        
        // Set the selected subject and start a session
        setSelectedSubject(subjectData.id);
        startSession({
          subjectId: subjectData.id,
          subjectName: subjectData.name,
          facultyId: user?.id,
          facultyName: user?.name
        });
        
        message.info(`Ready to take attendance for ${subjectData.name}`);
        
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

  // Handle NFC ID scan
  const handleIdScan = async (value) => {
    if (!value || !selectedSubject) {
      message.warning('Please select a subject first');
      return;
    }
    
    setStudentLoading(true);
    setStudentId(value);
    
    try {
      // Get student by NFC ID
      const response = await getStudentByNfcId(value);
      
      if (response.data.success) {
        const student = response.data.data;
        setCurrentStudent(student);
        
        // Record attendance using the context
        const selectedSubjectObj = subjects.find(s => s._id === selectedSubject);
        
        await recordAttendance({
          studentId: student._id,
          studentName: student.name,
          studentRollNumber: student.rollNumber,
          subjectId: selectedSubject,
          subjectName: selectedSubjectObj?.name || 'Unknown Subject',
          facultyId: user?.id,
          facultyName: user?.name,
          nfcId: value,
          course: student.course,
          section: student.class
        });
        
        message.success(`Successfully recorded attendance for ${student.name}`);
      } else {
        setCurrentStudent(null);
        message.error('Student ID not found');
      }
    } catch (error) {
      console.error('Error scanning student ID:', error);
      message.error('Failed to scan student ID');
    } finally {
      setStudentLoading(false);
      
      // Clear input after processing
      setStudentId('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const toggleScanMode = () => {
    if (!scanMode && !selectedSubject) {
      message.warning('Please select a subject first');
      return;
    }
    
    if (scanMode) {
      // Ending session
      endSession();
      message.info('Attendance session ended');
    } else {
      // Starting session
      const selectedSubjectObj = subjects.find(s => s._id === selectedSubject);
      if (selectedSubjectObj) {
        startSession({
          subjectId: selectedSubject,
          subjectName: selectedSubjectObj.name,
          facultyId: user?.id,
          facultyName: user?.name
        });
        message.info(`Started attendance session for ${selectedSubjectObj.name}`);
      }
    }
    
    setScanMode(prev => !prev);
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    
    // End current session if there is one
    if (currentSession) {
      endSession();
    }
    
    // Start new session if in scan mode
    if (scanMode) {
      const selectedSubjectObj = subjects.find(s => s._id === value);
      if (selectedSubjectObj) {
        startSession({
          subjectId: value,
          subjectName: selectedSubjectObj.name,
          facultyId: user?.id,
          facultyName: user?.name
        });
      }
    }
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => (
        <Space>
          <ClockCircleOutlined />
          {dayjs(timestamp).format('HH:mm:ss')}
        </Space>
      ),
    },
    {
      title: 'Student ID',
      dataIndex: 'studentRollNumber',
      key: 'studentRollNumber',
    },
    {
      title: 'Name',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {name}
        </Space>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Subject',
      dataIndex: 'subjectName',
      key: 'subjectName',
      render: (subject) => (
        <Space>
          <BookOutlined />
          {subject}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="green">PRESENT</Tag>,
    },
  ];

  return (
    <div>
      <Title level={2}>Attendance Console</Title>
      
      {attendanceError && (
        <Alert 
          message="Error" 
          description={attendanceError} 
          type="error" 
          showIcon 
          style={{ marginBottom: 16 }} 
        />
      )}
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card 
              title={<><BookOutlined /> Select Subject</>} 
              type="inner"
            >
              <Select
                placeholder="Select a subject"
                style={{ width: '100%' }}
                value={selectedSubject}
                onChange={handleSubjectChange}
                loading={subjectsLoading}
                disabled={scanMode}
              >
                {subjects.map(subject => (
                  <Option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </Option>
                ))}
              </Select>
            </Card>
          </Col>
          
          <Col xs={24} sm={16}>
            <Card 
              title={<><ScanOutlined /> Scan Student ID</>} 
              type="inner"
              extra={
                <Button 
                  type={scanMode ? "danger" : "primary"}
                  onClick={toggleScanMode}
                  disabled={!selectedSubject}
                >
                  {scanMode ? "End Session" : "Start Session"}
                </Button>
              }
            >
              {scanMode ? (
                <div>
                  <Alert
                    message="Scan Mode Active"
                    description={`Scanning for ${subjects.find(s => s._id === selectedSubject)?.name || 'selected subject'}. Place NFC card near the reader.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Search
                    ref={inputRef}
                    placeholder="NFC ID will appear here..."
                    enterButton="Record"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onSearch={handleIdScan}
                    loading={studentLoading}
                    autoFocus
                  />
                </div>
              ) : (
                <Empty 
                  description="Select a subject and click Start Session to begin scanning" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
      
      <Card 
        title={<><TeamOutlined /> Recent Check-ins</>}
        extra={
          <Button onClick={fetchRecentCheckins} loading={attendanceLoading}>
            Refresh
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={recentCheckins} 
          rowKey="_id"
          loading={attendanceLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Divider />
      
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Today's Statistics">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Statistic 
                  title="Total Check-ins Today" 
                  value={recentCheckins.filter(c => 
                    dayjs(c.timestamp).isSame(dayjs(), 'day')
                  ).length} 
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic 
                  title="Active Session" 
                  value={currentSession ? currentSession.subjectName : 'None'} 
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic 
                  title="Session Duration" 
                  value={currentSession ? dayjs().diff(dayjs(currentSession.startTime), 'minute') : 0} 
                  suffix="min" 
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AttendanceConsole;