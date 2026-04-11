import apiClient from './apiClient';

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 * @returns {Object} - The registered user data
 */
export const register = async (data) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    const { user, accessToken } = response.data;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    
    return user;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} data - { email, password }
 * @returns {Object} - The logged-in user data
 */
export const login = async (data) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    const { user, accessToken } = response.data;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    
    return user;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * Clears backend cookies and local storage tokens
 */
export const logout = async () => {
  try {
    // Explicitly call the backend to clear the httpOnly cookie and session
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    console.warn('Logout API call failed, still clearing local tokens:', error);
  } finally {
    // Always clear tokens from localStorage regardless of API success
    localStorage.removeItem('token');
  }
};

/**
 * Fetch the currently logged in user profile
 * @returns {Object} - The user data
 */
export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Get profile API error:', error);
    throw error;
  }
};
