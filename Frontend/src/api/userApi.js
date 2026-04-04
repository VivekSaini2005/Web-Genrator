import apiClient from './apiClient';

/**
 * Fetch the authenticated user's full profile
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data.user;
  } catch (error) {
    console.error('Fetch profile API error:', error);
    throw error;
  }
};

/**
 * Update the user's profile
 * @param {Object} data - { name: string, avatar_url: string }
 */
export const updateProfile = async (data) => {
  try {
    const response = await apiClient.put('/user/profile', data);
    return response.data.user;
  } catch (error) {
    console.error('Update profile API error:', error);
    throw error;
  }
};
