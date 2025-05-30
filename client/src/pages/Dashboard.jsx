import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  // Mock data - replace with actual API data
  const attendanceData = [
    {
      key: '1',
      subject: 'Mathematics',
      totalClasses: 30,
      attended: 28,
      percentage: 93.33,
    },
    {
      key: '2',
      subject: 'Physics',
      totalClasses: 25,
      attended: 22,
      percentage: 88.00,
    },
    {
      key: '3',
      subject: 'Computer Science',
      totalClasses: 28,
      attended: 25,
      percentage: 89.29,
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Total Classes',
      dataIndex: 'totalClasses',
      key: 'totalClasses',
    },
    {
      title: 'Attended',
      dataIndex: 'attended',
      key: 'attended',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => `${percentage.toFixed(2)}%`,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space size="middle">
          {record.percentage >= 85 ? (
            <Badge status="success" text="Good" />
          ) : record.percentage >= 75 ? (
            <Badge status="warning" text="Average" />
          ) : (
            <Badge status="error" text="Low" />
          )}
        </Space>
      ),
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      key: '1',
      activity: 'Attendance Marked',
      subject: 'Computer Science',
      status: 'Present',
      date: '2023-06-10',
    },
    {
      key: '2',
      activity: 'Attendance Marked',
      subject: 'Mathematics',
      status: 'Present',
      date: '2023-06-09',
    },
    {
      key: '3',
      activity: 'Attendance Marked',
      subject: 'Physics',
      status: 'Absent',
      date: '2023-06-08',
    },
  ];

  // Activity columns
  const activityColumns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === 'Present' ? 
          <Badge status="success" text="Present" /> : 
          <Badge status="error" text="Absent" />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={150}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Faculty"
              value={25}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Subjects"
              value={12}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Attendance"
              value={85.5}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Attendance Overview */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Attendance Overview">
            <Table columns={columns} dataSource={attendanceData} pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Activity">
            <Table columns={activityColumns} dataSource={recentActivity} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;