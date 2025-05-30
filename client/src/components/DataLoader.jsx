import React from 'react';
import { Spin, Alert, Empty } from 'antd';

/**
 * Reusable component to handle loading, error and empty states for data fetching
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Whether data is being loaded
 * @param {string} props.error - Error message if fetch failed
 * @param {any} props.data - Data that was fetched
 * @param {ReactNode} props.children - Child components to render when data is loaded
 * @param {string} props.emptyMessage - Message to display when data is empty
 * @returns {ReactNode} The appropriate UI based on the loading/error/data state
 */
const DataLoader = ({ 
  loading, 
  error, 
  data, 
  children, 
  emptyMessage = 'No data available' 
}) => {
  // Show loading spinner
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Spin spinning={true} size="large">
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <p>Loading data...</p>
          </div>
        </Spin>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // Show empty state if no data
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <Empty description={emptyMessage} />;
  }

  // Render children with data
  return children;
};

export default DataLoader; 