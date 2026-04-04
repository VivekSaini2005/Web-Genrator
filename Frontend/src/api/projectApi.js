import apiClient from './apiClient';

/**
 * Fetch a list of past generations/projects
 */
export const getProjects = async (limit = 50, offset = 0) => {
  try {
    const response = await apiClient.get(`/user/generations?limit=${limit}&offset=${offset}`);
    // Backend returns { count, limit, offset, generations }
    return response.data;
  } catch (error) {
    console.error('API Error: getProjects failed', error);
    throw error;
  }
};

/**
 * Fetch a specific generation/project with the full output code
 */
export const getProjectById = async (id) => {
  try {
    const response = await apiClient.get(`/user/generations/${id}`);
    // Backend returns { success, generation }
    return response.data.generation;
  } catch (error) {
    console.error(`API Error: getProjectById(${id}) failed`, error);
    throw error;
  }
};

/**
 * Placeholder logic for creating an empty project.
 * Currently, the backend creates a project only upon active code generation inside /generate
 */
export const createProject = async () => {
  return { 
    id: Date.now(), 
    prompt: "New Project", 
    created_at: new Date().toISOString() 
  };
};

/**
 * Send prompt to backend AI to generate or update code
 */
export const generateCode = async (prompt, currentCode, projectId) => {
  try {
    // Note: backend currently expects { prompt, currentCode } but we pass projectId as requested
    const response = await apiClient.post('/generate', { prompt, currentCode, projectId });
    return response.data; // { success, code, message, generationId }
  } catch (error) {
    console.error('API Error: generateCode failed', error);
    throw error;
  }
};
