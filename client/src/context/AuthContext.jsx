import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';
import { message } from 'antd';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Run only once on mount to check auth state from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.clear();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sync token to localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const response = await login(credentials);

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data;

        setUser(userData);
        setToken(authToken);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('isAuthenticated', 'true');

        message.success('Login successful!');
        return { success: true, role: userData.role };
      } else {
        message.error(response.data.message || 'Login failed!');
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      message.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await register(userData);

      if (response.data.success) {
        const { user: registeredUser, token: authToken } = response.data;

        setUser(registeredUser);
        setToken(authToken);

        localStorage.setItem('user', JSON.stringify(registeredUser));
        localStorage.setItem('userRole', registeredUser.role);
        localStorage.setItem('isAuthenticated', 'true');

        message.success('Registration successful!');
        return { success: true, role: registeredUser.role };
      } else {
        message.error(response.data.message || 'Registration failed!');
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      message.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');

    message.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        role: user?.role || '',
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
