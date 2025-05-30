import React, { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined,
  UserOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const FacultyLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/faculty/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/faculty/dashboard">Dashboard</Link>,
    },
    {
      key: '/faculty/manage-students',
      icon: <TeamOutlined />,
      label: <Link to="/faculty/manage-students">Manage Students</Link>,
    },
    {
      key: '/faculty/manage-subjects',
      icon: <BookOutlined />,
      label: <Link to="/faculty/manage-subjects">Manage Subjects</Link>,
    },
    {
      key: '/faculty/manage-attendance',
      icon: <ScheduleOutlined />,
      label: <Link to="/faculty/manage-attendance">Manage Attendance</Link>,
    },
    {
      key: '/faculty/attendance-panel',
      icon: <ScheduleOutlined />,
      label: <Link to="/faculty/attendance-panel">Attendance Panel</Link>,
    },
    {
      key: '/faculty/manage-reports',
      icon: <FileTextOutlined />,
      label: <Link to="/faculty/manage-reports">Reports</Link>,
    },
    {
      key: '/faculty/attendance-console',
      icon: <ScheduleOutlined />,
      label: <Link to="/faculty/attendance-console">Attendance Console</Link>,
    }
  ];

  const dropdownItems = {
    items: [
      {
        key: '1',
        label: 'Profile',
        icon: <UserOutlined />,
      },
      {
        key: '2',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: () => {
          // Execute the logout function passed as prop
          onLogout();
          navigate('/login');
        }
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} 
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" style={{ 
          height: '32px', 
          margin: '16px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: collapsed ? '14px' : '18px',
          fontWeight: 'bold'
        }}>
          {!collapsed ? 'SMACS Faculty' : 'SF'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' }
            })}
          </div>
          <div style={{ paddingRight: '24px' }}>
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default FacultyLayout;
