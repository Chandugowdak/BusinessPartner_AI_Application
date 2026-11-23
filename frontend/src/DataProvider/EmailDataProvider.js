import apiClient from './axiosInstance';

export const getEmailConfiguration = async () => {
  const response = await apiClient.get('/email/configuration');
  return response.data;
};

export const testEmailConfiguration = async () => {
  const response = await apiClient.post('/email/configuration/test');
  return response.data;
};

export const createEmailTemplate = async (payload) => {
  const response = await apiClient.post('/email/templates', payload);
  return response.data;
};

export const updateEmailTemplate = async (templateId, payload) => {
  const response = await apiClient.put(`/email/templates/${templateId}`, payload);
  return response.data;
};

export const deleteEmailTemplate = async (templateId) => {
  const response = await apiClient.delete(`/email/templates/${templateId}`);
  return response.data;
};

export const sendTemplateEmail = async (payload) => {
  const response = await apiClient.post('/email/send', payload);
  return response.data;
};

export const getEmailHistory = async (page = 1, limit = 20) => {
  const response = await apiClient.get('/email/history', { params: { page, limit } });
  return response.data;
};

export const getEmailSchedules = async () => {
  const response = await apiClient.get('/email/schedules');
  return response.data;
};

export const createEmailSchedule = async (payload) => {
  const response = await apiClient.post('/email/schedules', payload);
  return response.data;
};

export const updateEmailSchedule = async (scheduleId, payload) => {
  const response = await apiClient.put(`/email/schedules/${scheduleId}`, payload);
  return response.data;
};

export const deleteEmailSchedule = async (scheduleId) => {
  const response = await apiClient.delete(`/email/schedules/${scheduleId}`);
  return response.data;
};
