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
  Statistic,
  Empty
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
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { 
  getAllSubjects, 
  getSubjectsByFaculty, 
  getStudentsByClass, 
  getStudentsBySubject,
  getAttendanceBySubject,
  getAttendance
} from '../services/api';
import DataLoader from '../components/DataLoader';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const AttendancePanel = () => {
  const [form] = Form.useForm();
  const [attendanceData, setAttendanceData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isNfcScannerOpen, setIsNfcScannerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  // Use Attendance Context
  const { 
    recentCheckins, 
    loading: checkinLoading, 
    fetchRecentCheckins 
  } = useAttendance();
  
  // Get today's date
  const today = dayjs();
  const formattedToday = today.format('YYYY-MM-DD');

  // Fetch subjects based on user role
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

  // Fetch class data
  const {
    data: classesData,
    loading: classesLoading,
    error: classesError
  } = useFetch(getAllSubjects, {
    initialParams: {},
    fetchOnMount: true
  });

  const classes = classesData?.data?.map(subject => ({
    id: subject._id,
    name: subject.class || `Class ${subject.code}`
  })) || [];

  // Fetch students data based on selected class and subject
  const {
    data: studentsData,
    loading: studentsLoading,
    error: studentsError,
    refetch: fetchStudents
  } = useFetch(
    selectedClass ? getStudentsByClass : getStudentsBySubject,
    {
      initialParams: selectedClass || selectedSubject,
      fetchOnMount: false,
      dependencies: [selectedClass, selectedSubject]
    }
  );

  // Extract students array
  const students = studentsData?.data || [];

  useEffect(() => {
    // Fetch recent check-ins when component mounts
    fetchRecentCheckins();
  }, []);

  useEffect(() => {
    // If we have both a subject and class and students data is available
    if ((selectedClass || selectedSubject) && students.length > 0) {
      prepareAttendanceData();
    }
  }, [students, selectedClass, selectedSubject]);

  // Load attendance history for selected subject/class
  const loadAttendanceHistory = async (classId, subjectId) => {
    if (!subjectId) return;
    
    try {
      setHistoryLoading(true);
      
      const params = {
        startDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      };
      
      const response = await getAttendanceBySubject(subjectId, params);
      
      if (response.data.success) {
        // Process attendance history data
        const historyData = processAttendanceHistory(response.data.data);
        setAttendanceHistory(historyData);
      } else {
        message.error('Failed to load attendance history');
      }
    } catch (error) {
      console.error('Error loading attendance history:', error);
      message.error('Failed to load attendance history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Process attendance history data
  const processAttendanceHistory = (data) => {
    // Group by date
    const groupedByDate = data.reduce((acc, record) => {
      const date = dayjs(record.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});
    
    // Convert to array format needed for the table
    return Object.entries(groupedByDate).map(([date, records]) => {
      const totalStudents = students.length;
      const presentStudents = records.length;
      
      return {
        id: date,
        date,
        day: dayjs(date).format('dddd'),
        totalStudents,
        presentStudents,
        absentStudents: totalStudents - presentStudents,
        percentage: (presentStudents / totalStudents) * 100,
        status: 'Completed'
      };
    }).sort((a, b) => dayjs(b.date).diff(dayjs(a.date))); // Sort by date (newest first)
  };

  // Prepare attendance data from students
  const prepareAttendanceData = async () => {
    try {
      setAttendanceLoading(true);
      
      // Get today's attendance records for this subject
      const params = {
        date: selectedDate.format('YYYY-MM-DD'),
        subjectId: selectedSubject
      };
      
      const response = await getAttendance(params);
      const attendanceRecords = response.data.success ? response.data.data : [];
      
      // Map students to attendance format
      const attendanceData = students.map(student => {
        // Check if student has attendance record for today
        const record = attendanceRecords.find(r => r.studentId === student._id);
        
        return {
          id: student._id,
          name: student.name,
          roll: student.rollNumber,
          isPresent: !!record,
          arrivalTime: record ? dayjs(record.timestamp).format('HH:mm') : '',
          notes: record ? record.notes || '' : ''
        };
      });
      
      setAttendanceData(attendanceData);
      setShowTable(true);
    } catch (error) {
      console.error('Error preparing attendance data:', error);
      message.error('Failed to load attendance data');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleSearch = (values) => {
    const date = values.date || dayjs();
    setSelectedDate(date);
    setSelectedClass(values.class);
    setSelectedSubject(values.subject);
    
    // Load attendance history for this subject
    loadAttendanceHistory(values.class, values.subject);
    
    // Students will be fetched via the useFetch hook
    fetchStudents(values.class || values.subject);
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

  const handleSubmit = async () => {
    try {
      setAttendanceLoading(true);
      
      // Prepare attendance records
      const records = attendanceData
        .filter(student => student.isPresent)
        .map(student => ({
          studentId: student.id,
          studentName: student.name,
          studentRollNumber: student.roll,
          subjectId: selectedSubject,
          subjectName: subjects.find(s => s._id === selectedSubject)?.name || '',
          facultyId: user?.id,
          facultyName: user?.name,
          notes: student.notes,
          date: selectedDate.format('YYYY-MM-DD')
        }));
      
      // Use the API to mark attendance for each student
      // In a real app, you'd use a batch endpoint for this
      for (const record of records) {
        await markAttendance(record);
      }
      
      message.success('Attendance has been saved successfully!');
      
      // Refresh attendance history
      loadAttendanceHistory(selectedClass, selectedSubject);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      message.error('Failed to submit attendance');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleQuickScan = () => {
    const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
    if (selectedSubjectData) {
      // Store selected subject in localStorage for AttendanceConsole
      localStorage.setItem('selectedSubject', JSON.stringify({
        id: selectedSubjectData._id,
        name: selectedSubjectData.name
      }));
      
      // Navigate to attendance console
      navigate('/faculty/attendance-console');
    } else {
      message.warning('Please select a subject first');
    }
  };

  const handleScanClose = () => {
    setIsNfcScannerOpen(false);
  };

  const handleScanComplete = (studentId) => {
    // Mark attendance for scanned student
    const student = attendanceData.find(s => s.roll === studentId);
    if (student) {
      handleAttendanceChange(student.id, true);
      message.success(`Marked ${student.name} as present`);
    } else {
      message.error('Student not found in this class');
    }
    setIsNfcScannerOpen(false);
  };

  const columns = [
    {
      title: 'Roll Number',
      dataIndex: 'roll',
      key: 'roll',
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Attendance',
      dataIndex: 'isPresent',
      key: 'attendance',
      width: '15%',
      render: (isPresent, record) => (
        <Checkbox 
          checked={isPresent} 
          onChange={(e) => handleAttendanceChange(record.id, e.target.checked)}
        >
          {isPresent ? 'Present' : 'Absent'}
        </Checkbox>
      ),
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      width: '15%',
      render: (time) => time ? (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      ) : '-',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: '35%',
      render: (notes, record) => (
        <Input 
          placeholder="Add notes here" 
          value={notes} 
          onChange={(e) => handleNoteChange(record.id, e.target.value)}
        />
      ),
    },
  ];

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
    },
    {
      title: 'Absent',
      dataIndex: 'absentStudents',
      key: 'absentStudents',
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percent) => (
        <Tag color={percent >= 80 ? 'green' : percent >= 60 ? 'orange' : 'red'}>
          {percent.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color="green">
          <CheckCircleOutlined /> {status}
        </Tag>
      ),
    },
  ];

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
      render: (schedule) => (
        <Space>
          <ClockCircleOutlined />
          {schedule}
        </Space>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'blue'}>
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
          onClick={() => {
            form.setFieldsValue({
              subject: record.id,
              date: dayjs(record.date)
            });
            handleSearch(form.getFieldsValue());
          }}
        >
          Take Attendance
        </Button>
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
              <ContactsOutlined />
              Take Attendance
            </span>
          } 
          key="1"
        >
          <Card style={{ marginBottom: 16 }}>
            <Form 
              form={form} 
              layout="horizontal" 
              onFinish={handleSearch}
            >
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item 
                    label="Subject" 
                    name="subject"
                    rules={[{ required: true, message: 'Please select a subject' }]}
                  >
                    <Select 
                      placeholder="Select subject" 
                      loading={subjectsLoading}
                      onChange={(value) => setSelectedSubject(value)}
                    >
                      {subjects.map(subject => (
                        <Option key={subject._id} value={subject._id}>
                          {subject.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item 
                    label="Class" 
                    name="class"
                  >
                    <Select 
                      placeholder="Select class (optional)" 
                      loading={classesLoading}
                      onChange={(value) => setSelectedClass(value)}
                      allowClear
                    >
                      {classes.map(cls => (
                        <Option key={cls.id} value={cls.id}>
                          {cls.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item 
                    label="Date" 
                    name="date"
                    initialValue={dayjs()}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="YYYY-MM-DD"
                      disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<ScanOutlined />} 
                      onClick={handleQuickScan}
                      disabled={!selectedSubject}
                    >
                      Quick Scan Mode
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<CheckCircleOutlined />}
                    >
                      Load Students
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
          
          {showTable ? (
            <DataLoader
              loading={attendanceLoading || studentsLoading}
              error={studentsError}
              data={attendanceData}
              emptyMessage="No students found in this class/subject"
            >
              <Card 
                title={
                  <Space>
                    <CheckCircleOutlined />
                    <span>Attendance Sheet</span>
                    <Tag color="blue">
                      {selectedDate.format('YYYY-MM-DD')} ({selectedDate.format('dddd')})
                    </Tag>
                    <Tag color="green">
                      {subjects.find(s => s._id === selectedSubject)?.name || 'Selected Subject'}
                    </Tag>
                  </Space>
                }
                extra={
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSubmit}
                    loading={attendanceLoading}
                  >
                    Save Attendance
                  </Button>
                }
              >
                <Table 
                  columns={columns} 
                  dataSource={attendanceData}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  bordered
                />
                
                <Divider />
                
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic 
                      title="Total Students" 
                      value={attendanceData.length} 
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Present" 
                      value={attendanceData.filter(s => s.isPresent).length} 
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Attendance Rate" 
                      value={
                        attendanceData.length === 0 
                          ? 0 
                          : (attendanceData.filter(s => s.isPresent).length / attendanceData.length * 100).toFixed(1)
                      } 
                      suffix="%"
                      valueStyle={{ color: '#1677ff' }}
                    />
                  </Col>
                </Row>
              </Card>
            </DataLoader>
          ) : (
            <Card>
              <Empty 
                description="Select a subject and click 'Load Students' to begin attendance" 
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
          key="2"
        >
          <Card>
            <DataLoader
              loading={historyLoading}
              error={null}
              data={attendanceHistory}
              emptyMessage="No attendance history found"
            >
              <Table 
                columns={historyColumns} 
                dataSource={attendanceHistory}
                rowKey="id"
                pagination={{ pageSize: 7 }}
              />
            </DataLoader>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <DashboardOutlined />
              Recent Check-ins
            </span>
          } 
          key="3"
        >
          <Card
            extra={
              <Button 
                onClick={fetchRecentCheckins} 
                loading={checkinLoading}
              >
                Refresh
              </Button>
            }
          >
            <DataLoader
              loading={checkinLoading}
              error={null}
              data={recentCheckins}
              emptyMessage="No recent check-ins found"
            >
              <List
                itemLayout="horizontal"
                dataSource={recentCheckins}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <span>{item.studentName}</span>
                          <Tag color="blue">{item.studentRollNumber}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical">
                          <Text>
                            <ClockCircleOutlined /> {dayjs(item.timestamp).format('HH:mm:ss')} on {dayjs(item.timestamp).format('YYYY-MM-DD')}
                          </Text>
                          <Text>
                            Subject: {item.subjectName}
                          </Text>
                        </Space>
                      }
                    />
                    <Tag color="green">PRESENT</Tag>
                  </List.Item>
                )}
                pagination={{
                  pageSize: 5,
                  size: 'small'
                }}
              />
            </DataLoader>
          </Card>
        </TabPane>
      </Tabs>
      
      <Modal
        title="NFC Scanner"
        open={isNfcScannerOpen}
        onCancel={handleScanClose}
        footer={null}
      >
        <Alert
          message="Scan student NFC card"
          description="Place the student's NFC card near the scanner to mark attendance."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Search
          placeholder="NFC ID will appear here..."
          enterButton="Record"
          onSearch={handleScanComplete}
          size="large"
        />
      </Modal>
    </div>
  );
};

export default AttendancePanel;