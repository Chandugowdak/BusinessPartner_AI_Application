import apiClient from './axiosInstance';

export const loginUser = async (payload) => {
  const response = await apiClient.post('/user/login', payload);
  return response.data;
};

export const updateUser = async (userId, payload) => {
  const response = await apiClient.put(`/user/update/${userId}`, payload);
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
