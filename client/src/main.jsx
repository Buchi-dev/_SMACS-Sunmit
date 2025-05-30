import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AttendanceProvider } from './context/AttendanceContext'
import './styles.css'

// Ant Design theme customization
const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 4,
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <AttendanceProvider>
          <App />
        </AttendanceProvider>
      </AuthProvider>
    </ConfigProvider>
  </StrictMode>,
)
