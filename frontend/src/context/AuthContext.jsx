import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Endpoint to get current user details
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error("Token verification failed", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Placeholder login logic - to be implemented with API
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username: email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // Fetch user profile
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
