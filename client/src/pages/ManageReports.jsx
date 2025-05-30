import React, { useState } from 'react';
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
  TeamOutlined
} from '@ant-design/icons';

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

  // Mock classes and subjects
  const classes = [
    { id: 1, name: 'Class A' },
    { id: 2, name: 'Class B' },
    { id: 3, name: 'Class C' },
  ];

  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Computer Science' },
  ];

  // Mock data generators for different report types
  const generateClassAttendanceReport = (classId, dateRange) => {
    const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English', 'History'];
    return subjects.map((subject, index) => {
      // Generate random percentage between 70 and 100
      const percentage = Math.floor(Math.random() * 30) + 70;
      return {
        id: index + 1,
        subject,
        percentage,
        totalStudents: 30,
        present: Math.floor(30 * (percentage / 100)),
        absent: Math.floor(30 * (1 - percentage / 100)),
        class: classes.find(c => c.id === classId)?.name || '',
      };
    });
  };

  const generateSubjectAttendanceReport = (subjectId, dateRange) => {
    const classNames = ['Class A', 'Class B', 'Class C'];
    return classNames.map((className, index) => {
      // Generate random percentage between 70 and 100
      const percentage = Math.floor(Math.random() * 30) + 70;
      return {
        id: index + 1,
        class: className,
        percentage,
        totalStudents: 30,
        present: Math.floor(30 * (percentage / 100)),
        absent: Math.floor(30 * (1 - percentage / 100)),
        subject: subjects.find(s => s.id === subjectId)?.name || '',
      };
    });
  };

  const generateStudentAttendanceReport = (classId, subjectId, dateRange) => {
    const students = [
      'John Doe',
      'Jane Smith',
      'Michael Johnson',
      'Emily Davis',
      'Robert Brown',
      'Sophia Wilson',
      'William Taylor',
      'Olivia Martinez',
      'James Anderson',
      'Emma Thomas'
    ];

    return students.map((name, index) => {
      // Generate random percentage between 60 and 100
      const percentage = Math.floor(Math.random() * 40) + 60;
      const totalClasses = 50;
      return {
        id: index + 1,
        rollNumber: `STD00${index + 1}`,
        name,
        percentage,
        totalClasses,
        present: Math.floor(totalClasses * (percentage / 100)),
        absent: totalClasses - Math.floor(totalClasses * (percentage / 100)),
        class: classes.find(c => c.id === classId)?.name || '',
        subject: subjects.find(s => s.id === subjectId)?.name || '',
      };
    });
  };

  const handleSearch = (values) => {
    setLoading(true);
    setReportType(values.reportType);
    
    // Simulate API call
    setTimeout(() => {
      let data = [];
      switch (values.reportType) {
        case 'class':
          data = generateClassAttendanceReport(values.class, values.dateRange);
          break;
        case 'subject':
          data = generateSubjectAttendanceReport(values.subject, values.dateRange);
          break;
        case 'student':
          data = generateStudentAttendanceReport(values.class, values.subject, values.dateRange);
          break;
        default:
          data = [];
      }
      setReportData(data);
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    form.resetFields();
    setReportData([]);
    setReportType(null);
  };

  const exportToExcel = () => {
    message.success('Report exported to Excel successfully!');
  };

  const exportToPdf = () => {
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
      render: (percentage) => (
        <Progress 
          percent={percentage} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
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
      render: (percentage) => (
        <Progress 
          percent={percentage} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
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
          <Avatar size="small" icon={<UserOutlined />} />
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
      render: (percentage) => (
        <Progress 
          percent={percentage} 
          size="small"
          status={percentage < 75 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
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

  // Function to render appropriate table based on report type
  const renderReportTable = () => {
    if (!reportType || reportData.length === 0) {
      return (
        <Empty description="No report data available. Please generate a report." />
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
      <Table 
        columns={columns}
        dataSource={reportData}
        rowKey="id"
        pagination={false}
        loading={loading}
      />
    );
  };

  // Function to render stats cards based on report type
  const renderStats = () => {
    if (!reportType || reportData.length === 0) {
      return null;
    }

    // Calculate average attendance percentage
    const avgPercentage = reportData.reduce((acc, curr) => acc + curr.percentage, 0) / reportData.length;
    
    // Count entities below 75%
    const belowThreshold = reportData.filter(item => item.percentage < 75).length;

    return (
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title={`Total ${reportType === 'class' ? 'Subjects' : reportType === 'subject' ? 'Classes' : 'Students'}`} 
              value={reportData.length} 
              prefix={reportType === 'class' ? <BookOutlined /> : reportType === 'subject' ? <TeamOutlined /> : <UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="Average Attendance" 
              value={avgPercentage.toFixed(2)}
              suffix="%"
              valueStyle={{ color: avgPercentage >= 85 ? '#3f8600' : avgPercentage >= 75 ? '#faad14' : '#cf1322' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="Below 75% Threshold" 
              value={belowThreshold}
              suffix={`/ ${reportData.length}`}
              valueStyle={{ color: belowThreshold > 0 ? '#cf1322' : '#3f8600' }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Title level={2}>Manage Reports</Title>
      
      {/* Report Generator Form */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="reportType"
                label="Report Type"
                rules={[{ required: true, message: 'Please select report type' }]}
              >
                <Select 
                  placeholder="Select report type"
                  onChange={(value) => setReportType(value)}
                >
                  <Option value="class">Class Attendance Report</Option>
                  <Option value="subject">Subject Attendance Report</Option>
                  <Option value="student">Student Attendance Report</Option>
                </Select>
              </Form.Item>
            </Col>
            
            {(reportType === 'class' || reportType === 'student') && (
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
            )}
            
            {(reportType === 'subject' || reportType === 'student') && (
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
            )}
            
            <Col xs={24} sm={reportType === 'student' ? 24 : 8}>
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
                <Button onClick={resetForm}>Reset</Button>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  htmlType="submit"
                  loading={loading}
                >
                  Generate Report
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {/* Report Results */}
      {reportData.length > 0 && (
        <Card>
          {/* Report Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4}>
              {reportType === 'class' 
                ? `Attendance Report for ${reportData[0]?.class}`
                : reportType === 'subject'
                  ? `Attendance Report for ${reportData[0]?.subject}`
                  : `Student Attendance Report for ${reportData[0]?.class} - ${reportData[0]?.subject}`
              }
            </Title>
            <Space>
              <Button 
                icon={<FileExcelOutlined />} 
                onClick={exportToExcel}
              >
                Export Excel
              </Button>
              <Button 
                icon={<FilePdfOutlined />} 
                onClick={exportToPdf}
              >
                Export PDF
              </Button>
            </Space>
          </div>
          
          {/* Stats Cards */}
          {renderStats()}
          
          {/* Report Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Table View" key="1">
              {renderReportTable()}
            </TabPane>
            <TabPane tab="Chart View" key="2">
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <PieChartOutlined style={{ fontSize: 64, color: '#1677ff' }} />
                <p style={{ marginTop: 16 }}>Charts would be displayed here. Implement with Chart.js or Recharts library.</p>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ManageReports;