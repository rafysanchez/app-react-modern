import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import apiClient from '../services/api/apiClient';
import { authService } from '../services/auth.service';

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = () => {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if(originalRequest.headers)
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          })
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          authService.refreshAccessToken()
            .then(newAccessToken => {
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                }
                processQueue(null, newAccessToken);
                resolve(apiClient(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
              authService.logout();
              reject(err);
              // You might want to redirect to login page here
              window.location.href = '/login';
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    }
  );
};