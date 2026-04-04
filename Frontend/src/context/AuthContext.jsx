import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getProfile } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to fetch user profile, clearing session:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data) => {
    const userData = await loginApi(data);
    setUser(userData);
    setToken(localStorage.getItem('token'));
    return userData;
  };

  const register = async (data) => {
    const userData = await registerApi(data);
    setUser(userData);
    setToken(localStorage.getItem('token'));
    return userData;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
