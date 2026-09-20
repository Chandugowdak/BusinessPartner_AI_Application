import apiClient from "./axiosInstance";

export async function submitReport(formData) {
  const response = await apiClient.post("/reports", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
}

export async function submitContact(payload) {
  const response = await apiClient.post("/contacts", payload);
  return response.data;
}
