import React, { createContext, useContext, useState, useCallback } from 'react';
import { message } from 'antd';
import { markAttendance, getRecentCheckins } from '../services/api';

// Create attendance context
const AttendanceContext = createContext();

// Custom hook to use attendance context
export const useAttendance = () => useContext(AttendanceContext);

// Attendance provider component
export const AttendanceProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a new attendance session
  const startSession = useCallback((sessionData) => {
    setCurrentSession(sessionData);
    message.success(`Started attendance session for ${sessionData.subjectName}`);
  }, []);

  // End the current attendance session
  const endSession = useCallback(() => {
    setCurrentSession(null);
    message.info('Attendance session ended');
  }, []);

  // Mark attendance for a student
  const recordAttendance = useCallback(async (attendanceData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await markAttendance(attendanceData);
      
      if (response.data.success) {
        // Add to recent checkins at the beginning of the array
        setRecentCheckins(prev => [response.data.data, ...prev].slice(0, 20));
        message.success(`Attendance recorded for ${attendanceData.studentName || 'student'}`);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to record attendance');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to record attendance';
      setError(errorMsg);
      message.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent check-ins
  const fetchRecentCheckins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getRecentCheckins();
      
      if (response.data.success) {
        setRecentCheckins(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch recent check-ins');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch recent check-ins';
      setError(errorMsg);
      console.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        currentSession,
        recentCheckins,
        loading,
        error,
        startSession,
        endSession,
        recordAttendance,
        fetchRecentCheckins
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext; 