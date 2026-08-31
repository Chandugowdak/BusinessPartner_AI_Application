import apiClient from './axiosInstance';

export const loginUser = async (payload) => {
  const response = await apiClient.post('/user/login', payload);
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
