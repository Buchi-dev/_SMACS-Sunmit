import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Form, 
  Select, 
  DatePicker, 
  Space, 
  Table, 
  Progress, 
  Tabs, 
  Tag, 
  Row, 
  Col,
  Statistic,
  Divider,
  message,
  Empty,
  List,
  Avatar
} from 'antd';
import { 
  FileExcelOutlined, 
  FilePdfOutlined, 
  SearchOutlined, 
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { 
  getAllSubjects, 
  getSubjectsByFaculty,
  getClassReport, 
  getSubjectReport, 
  getStudentReport,
  getAllStudents,
  getStudentsByClass
} from '../services/api';
import useFetch from '../hooks/useFetch';
import DataLoader from '../components/DataLoader';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ManageReports = () => {
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedDateRange, setSelectedDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { user, role } = useAuth();

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

  // Classes are derived from subjects
  const classes = Array.from(new Set(subjects.map(subject => subject.class))).filter(Boolean).map((className, index) => ({
    id: index + 1,
    name: className
  }));

  // Fetch students based on selected class
  const {
    data: studentsData,
    loading: studentsLoading,
    refetch: fetchStudents
  } = useFetch(
    selectedClass ? getStudentsByClass : getAllStudents,
    {
      initialParams: selectedClass || {},
      fetchOnMount: false
    }
  );

  // Extract students array
  const students = studentsData?.data || [];

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchReportData = async (values) => {
    try {
      setLoading(true);
      setReportType(values.reportType);
      
      const dateRange = values.dateRange || selectedDateRange;
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD')
      };
      
      let response;
      
      switch (values.reportType) {
        case 'class':
          response = await getClassReport(values.class, params);
          break;
        case 'subject':
          response = await getSubjectReport(values.subject, params);
          break;
        case 'student':
          if (values.student) {
            response = await getStudentReport(values.student, {
              ...params,
              subjectId: values.subject
            });
          }
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      if (response.data.success) {
        setReportData(processReportData(values.reportType, response.data.data));
      } else {
        message.error('Failed to fetch report data');
        setReportData([]);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Failed to fetch report data');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (type, data) => {
    switch (type) {
      case 'class':
        return processClassReport(data);
      case 'subject':
        return processSubjectReport(data);
      case 'student':
        return processStudentReport(data);
      default:
        return [];
    }
  };

  const processClassReport = (data) => {
    return data.map((item, index) => ({
      id: index + 1,
      subject: item.subjectName,
      subjectId: item.subjectId,
      percentage: item.attendancePercentage || 0,
      totalStudents: item.totalStudents || 0,
      present: item.presentCount || 0,
      absent: item.absentCount || 0,
      class: item.className || '',
    }));
  };

  const processSubjectReport = (data) => {
    return data.map((item, index) => ({
      id: index + 1,
      class: item.className,
      classId: item.classId,
      percentage: item.attendancePercentage || 0,
      totalStudents: item.totalStudents || 0,
      present: item.presentCount || 0,
      absent: item.absentCount || 0,
      subject: item.subjectName || '',
    }));
  };

  const processStudentReport = (data) => {
    return data.map((item, index) => ({
      id: index + 1,
      rollNumber: item.studentRollNumber,
      name: item.studentName,
      studentId: item.studentId,
      percentage: item.attendancePercentage || 0,
      totalClasses: item.totalClasses || 0,
      present: item.presentCount || 0,
      absent: item.absentCount || 0,
      class: item.className || '',
      subject: item.subjectName || '',
    }));
  };

  const handleSearch = (values) => {
    setSelectedClass(values.class);
    setSelectedSubject(values.subject);
    if (values.dateRange) {
      setSelectedDateRange(values.dateRange);
    }
    
    fetchReportData(values);
  };

  const resetForm = () => {
    form.resetFields();
    setReportData([]);
    setReportType(null);
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedDateRange([dayjs().subtract(30, 'days'), dayjs()]);
  };

  const exportToExcel = () => {
    // In a real app, this would generate and download an Excel file
    message.success('Report exported to Excel successfully!');
  };

  const exportToPdf = () => {
    // In a real app, this would generate and download a PDF file
    message.success('Report exported to PDF successfully!');
  };

  // Class attendance report columns
  const classReportColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => (
        <Space>
          <BookOutlined style={{ color: '#1677ff' }} />
          {text}
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
      sorter: (a, b) => a.percentage - b.percentage,
      render: (percentage) => (
        <Progress 
          percent={parseFloat(percentage).toFixed(1)} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      filters: [
        { text: 'Good', value: 'good' },
        { text: 'Average', value: 'average' },
        { text: 'Poor', value: 'poor' },
      ],
      onFilter: (value, record) => {
        if (value === 'good') return record.percentage >= 85;
        if (value === 'average') return record.percentage >= 75 && record.percentage < 85;
        if (value === 'poor') return record.percentage < 75;
        return true;
      },
      render: (_, record) => {
        let color = 'green';
        let text = 'Good';
        
        if (record.percentage < 75) {
          color = 'red';
          text = 'Poor';
        } else if (record.percentage < 85) {
          color = 'orange';
          text = 'Average';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // Subject attendance report columns
  const subjectReportColumns = [
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      render: (text) => (
        <Space>
          <TeamOutlined style={{ color: '#1677ff' }} />
          {text}
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
      sorter: (a, b) => a.percentage - b.percentage,
      render: (percentage) => (
        <Progress 
          percent={parseFloat(percentage).toFixed(1)} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      filters: [
        { text: 'Good', value: 'good' },
        { text: 'Average', value: 'average' },
        { text: 'Poor', value: 'poor' },
      ],
      onFilter: (value, record) => {
        if (value === 'good') return record.percentage >= 85;
        if (value === 'average') return record.percentage >= 75 && record.percentage < 85;
        if (value === 'poor') return record.percentage < 75;
        return true;
      },
      render: (_, record) => {
        let color = 'green';
        let text = 'Good';
        
        if (record.percentage < 75) {
          color = 'red';
          text = 'Poor';
        } else if (record.percentage < 85) {
          color = 'orange';
          text = 'Average';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // Student attendance report columns
  const studentReportColumns = [
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
    },
    {
      title: 'Student Name',
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
      sorter: (a, b) => a.percentage - b.percentage,
      render: (percentage) => (
        <Progress 
          percent={parseFloat(percentage).toFixed(1)} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      filters: [
        { text: 'Good', value: 'good' },
        { text: 'Average', value: 'average' },
        { text: 'Poor', value: 'poor' },
      ],
      onFilter: (value, record) => {
        if (value === 'good') return record.percentage >= 85;
        if (value === 'average') return record.percentage >= 75 && record.percentage < 85;
        if (value === 'poor') return record.percentage < 75;
        return true;
      },
      render: (_, record) => {
        let color = 'green';
        let text = 'Good';
        
        if (record.percentage < 75) {
          color = 'red';
          text = 'Poor';
        } else if (record.percentage < 85) {
          color = 'orange';
          text = 'Average';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const renderReportTable = () => {
    if (!reportType || reportData.length === 0) {
      return (
        <Empty 
          description="No report data available. Please select report parameters and search." 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    let columns = [];
    switch (reportType) {
      case 'class':
        columns = classReportColumns;
        break;
      case 'subject':
        columns = subjectReportColumns;
        break;
      case 'student':
        columns = studentReportColumns;
        break;
      default:
        columns = [];
    }

    return (
      <DataLoader
        loading={loading}
        error={null}
        data={reportData}
        emptyMessage="No report data available"
      >
        <Table 
          columns={columns} 
          dataSource={reportData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </DataLoader>
    );
  };

  const renderStats = () => {
    if (!reportType || reportData.length === 0) {
      return null;
    }

    const totalAttendance = reportData.reduce((sum, item) => sum + item.percentage, 0) / reportData.length;
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalStudents = 0;
    
    reportData.forEach(item => {
      totalPresent += item.present;
      totalAbsent += item.absent;
      if (reportType !== 'student') {
        totalStudents += item.totalStudents;
      }
    });
    
    if (reportType === 'student') {
      totalStudents = reportData.length;
    }

    return (
      <Card style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="Average Attendance" 
              value={parseFloat(totalAttendance).toFixed(1)} 
              suffix="%" 
              valueStyle={{ color: totalAttendance >= 85 ? '#3f8600' : totalAttendance >= 75 ? '#faad14' : '#cf1322' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Total Students" 
              value={totalStudents} 
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Present Count" 
              value={totalPresent} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Absent Count" 
              value={totalAbsent} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div>
      <Title level={2}>Attendance Reports</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <SearchOutlined />
              Generate Reports
            </span>
          } 
          key="1"
        >
          <Card>
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSearch}
              initialValues={{
                reportType: 'class',
                dateRange: selectedDateRange
              }}
            >
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item
                    label="Report Type"
                    name="reportType"
                    rules={[{ required: true, message: 'Please select report type' }]}
                  >
                    <Select 
                      placeholder="Select report type"
                      onChange={(value) => {
                        setReportType(value);
                        form.setFieldsValue({
                          class: null,
                          subject: null,
                          student: null
                        });
                      }}
                    >
                      <Option value="class">Class Report</Option>
                      <Option value="subject">Subject Report</Option>
                      <Option value="student">Student Report</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={6}>
                  <Form.Item
                    label="Date Range"
                    name="dateRange"
                    rules={[{ required: true, message: 'Please select date range' }]}
                  >
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                {(reportType === 'class' || reportType === 'student') && (
                  <Col span={6}>
                    <Form.Item
                      label="Class"
                      name="class"
                      rules={[{ required: true, message: 'Please select class' }]}
                    >
                      <Select 
                        placeholder="Select class"
                        loading={subjectsLoading}
                        onChange={(value) => setSelectedClass(value)}
                      >
                        {classes.map(cls => (
                          <Option key={cls.id} value={cls.name}>{cls.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                
                {(reportType === 'subject' || reportType === 'student') && (
                  <Col span={6}>
                    <Form.Item
                      label="Subject"
                      name="subject"
                      rules={[{ required: true, message: 'Please select subject' }]}
                    >
                      <Select 
                        placeholder="Select subject"
                        loading={subjectsLoading}
                        onChange={(value) => setSelectedSubject(value)}
                      >
                        {subjects.map(subject => (
                          <Option key={subject._id} value={subject._id}>{subject.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                
                {reportType === 'student' && selectedClass && (
                  <Col span={6}>
                    <Form.Item
                      label="Student"
                      name="student"
                      rules={[{ required: true, message: 'Please select student' }]}
                    >
                      <Select 
                        placeholder="Select student"
                        loading={studentsLoading}
                      >
                        {students.map(student => (
                          <Option key={student._id} value={student._id}>
                            {student.name} ({student.rollNumber})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    Generate Report
                  </Button>
                  <Button onClick={resetForm}>Reset</Button>
                  
                  {reportData.length > 0 && (
                    <>
                      <Button 
                        type="primary" 
                        icon={<FileExcelOutlined />} 
                        onClick={exportToExcel}
                        style={{ background: '#52c41a', borderColor: '#52c41a' }}
                      >
                        Export to Excel
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<FilePdfOutlined />} 
                        onClick={exportToPdf}
                        danger
                      >
                        Export to PDF
                      </Button>
                    </>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          {renderStats()}
          
          <Card style={{ marginTop: 16 }}>
            {renderReportTable()}
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              Visual Reports
            </span>
          } 
          key="2"
        >
          <Card>
            <Empty 
              description="Visual reports will be available in future updates." 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ManageReports;