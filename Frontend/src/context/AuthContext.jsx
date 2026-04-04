import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import * as userApi from '../api/userApi';

// 1. Create Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // 4. On App Load: Check token & fetch user profile
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token and fetch user details from backend using userApi
          const userData = await userApi.getProfile();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Session expired or invalid token", error);
          // Token is invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 3. Functions
  const register = async (data) => {
    const userData = await authApi.register(data);
    setUser(userData);
    setToken(localStorage.getItem('token'));
    return userData;
  };

  const login = async (data) => {
    const userData = await authApi.login(data);
    setUser(userData);
    setToken(localStorage.getItem('token'));
    return userData; 
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
