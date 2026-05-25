import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://rickandmortyapi.com';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.get<T, T>(url, config);
  },
};
