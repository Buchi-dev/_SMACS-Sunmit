import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization token to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const registerFaculty = (userData) => API.post('/auth/register-faculty', userData);

// Student endpoints
export const getAllStudents = (params) => API.get('/students', { params });
export const getStudentById = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const getStudentsByClass = (className) => API.get(`/students/class/${className}`);
export const getStudentsBySubject = (subjectId) => API.get(`/students/subject/${subjectId}`);
export const getStudentByNfcId = (nfcId) => API.get(`/students/nfc/${nfcId}`);

// Faculty endpoints
export const getAllFaculty = (params) => API.get('/faculty', { params });
export const getFacultyById = (id) => API.get(`/faculty/${id}`);
export const createFaculty = (data) => API.post('/faculty', data);
export const updateFaculty = (id, data) => API.put(`/faculty/${id}`, data);
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);

// Subject endpoints
export const getAllSubjects = (params) => API.get('/subjects', { params });
export const getSubjectById = (id) => API.get(`/subjects/${id}`);
export const createSubject = (data) => API.post('/subjects', data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);
export const getSubjectsByFaculty = (facultyId) => API.get(`/subjects/faculty/${facultyId}`);

// Attendance endpoints
export const markAttendance = (data) => API.post('/attendance', data);
export const getAttendance = (params) => API.get('/attendance', { params });
export const getAttendanceByStudent = (studentId, params) => API.get(`/attendance/student/${studentId}`, { params });
export const getAttendanceBySubject = (subjectId, params) => API.get(`/attendance/subject/${subjectId}`, { params });
export const updateAttendanceRecord = (id, data) => API.put(`/attendance/${id}`, data);
export const getAttendanceStats = (params) => API.get('/attendance/stats', { params });
export const getRecentCheckins = () => API.get('/attendance/recent-checkins');

// User endpoints
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Report endpoints
export const getClassReport = (className, params) => API.get(`/reports/class/${className}`, { params });
export const getSubjectReport = (subjectId, params) => API.get(`/reports/subject/${subjectId}`, { params });
export const getStudentReport = (studentId, params) => API.get(`/reports/student/${studentId}`, { params });

export default API; 