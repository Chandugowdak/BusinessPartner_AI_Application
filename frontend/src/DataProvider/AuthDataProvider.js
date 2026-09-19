import apiClient from './axiosInstance';

export const loginUser = async (payload) => {
  const response = await apiClient.post('/user/login', payload);
  return response.data;
};

export const updateUser = async (userId, payload) => {
  const response = await apiClient.put(`/user/update/${userId}`, payload);
  return response.data;
};

export const getUsers = async (params) => {
  const response = await apiClient.get('/user/users', { params });
  return response.data;
};

export const getConnections = async () => {
  const response = await apiClient.get('/connections');
  return response.data;
};

export const sendConnectionRequest = async (userId) => {
  const response = await apiClient.post(`/connections/request/${userId}`);
  return response.data;
};

export const acceptConnection = async (connectionId) => {
  const response = await apiClient.patch(`/connections/${connectionId}/accept`);
  return response.data;
};

export const rejectConnection = async (connectionId) => {
  const response = await apiClient.patch(`/connections/${connectionId}/reject`);
  return response.data;
};

export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationsRead = async () => {
  const response = await apiClient.patch('/notifications/read');
  return response.data;
};

export const getConversation = async (connectionId) => {
  const response = await apiClient.get(`/connections/${connectionId}/messages`);
  return response.data;
};

export const sendMessage = async (connectionId, body) => {
  const response = await apiClient.post(`/connections/${connectionId}/messages`, { body });
  return response.data;
};

export const uploadProfilePhoto = async (userId, file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await apiClient.post(`/user/photo/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const registerUser = async (payload) => {
  const formattedPayload = {
    ...payload,
    confirmPassword: payload.confirmPassword ?? payload.confirm,
  };

  delete formattedPayload.confirm;

  const response = await apiClient.post('/user/register', formattedPayload);
  return response.data;
};
